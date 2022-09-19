import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { OrbitControls } from './OrbitControls'
import { GUI } from 'dat.gui';


const scene = new THREE.Scene();
const gui = new GUI();

// 创建世界，可以在构造函数中指定一些世界的基本参数
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) })
// cannon没法直接展示物理模拟效果，只能进行演算，所以一般做法是
// 物理世界中再加个参数类似的物品，然后渲染时将其数值映射到three.js物品中
const radius = 2;
// 创建物理物品
const sphereBody = new CANNON.Body({
  mass: 5, // kg
  shape: new CANNON.Sphere(radius),
})
sphereBody.position.set(0, 10, 0) // m
// 将物理材质加入到世界中
world.addBody(sphereBody)

const planeBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane()
})

const sphereBodyMaterial = new CANNON.Material("shpere");
const planeBodyMaterial = new CANNON.Material("plane");

sphereBody.material = sphereBodyMaterial;
planeBody.material = planeBodyMaterial;

const contactMaterial = new CANNON.ContactMaterial(sphereBodyMaterial, planeBodyMaterial, {
  // 摩擦力和弹性
  friction: 0.3,
  restitution: 0.7
})


planeBody.addEventListener('collide', (e) => {
  const v = e.contact.getImpactVelocityAlongNormal();
  console.log(v);
})

world.addContactMaterial(contactMaterial);

planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
planeBody.position.set(0, -2, 0);

world.addBody(planeBody);


const axeHelper = new THREE.AxesHelper(10);
scene.add(axeHelper);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

const control = new OrbitControls(camera, renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('texture/hardwood2_diffuse.jpg');

const sphereGeometry = new THREE.SphereGeometry(2, 30, 30);
const sphereMaterial = new THREE.MeshStandardMaterial({
  map: woodTexture,
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.y = 10;

const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.y = -2;
plane.rotation.set(Math.PI / 2, 0, 0);

const light = new THREE.AmbientLight(0x4f4f4f);

// 设置平行光
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(0, 1, 1);
directionalLight.target = sphere;
gui.add(directionalLight.position, "x", 0, 10, 0.01)
gui.add(directionalLight.position, "y", 0, 10, 0.01)
gui.add(directionalLight.position, "z", 0, 10, 0.01)


renderer.setSize(window.innerWidth, window.innerHeight);

// 开启渲染器光阴影计算
renderer.shadowMap.enabled = true;
// 设置平行光投影
directionalLight.castShadow = true;
// 设置聚光灯投影

// 设置物体投射阴影
sphere.castShadow = true;
// 设置物体接收阴影
plane.receiveShadow = true;

scene.add(camera);
scene.add(sphere);
scene.add(plane);
scene.add(light);
scene.add(directionalLight);

control.update();

const clock = new THREE.Clock();

(function ani() {
  requestAnimationFrame(ani);

  const fps = clock.getDelta();

  renderer.render(scene, camera);
  control.update();

  // 将物理世界的属性映射到three.js中渲染
  sphere.position.copy(sphereBody.position)
  sphere.quaternion.copy(sphereBody.quaternion)


  // 更新物理世界，可以接受一个参数，默认是1 / 60，也就是 60ms刷新一次
  // 当然更好的做法是跟随屏幕帧数进行计算
  world.fixedStep(fps);
})()