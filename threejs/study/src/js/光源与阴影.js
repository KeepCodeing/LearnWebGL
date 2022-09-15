import * as THREE from 'three'
import { OrbitControls } from './OrbitControls'
import { GUI } from 'dat.gui';

const scene = new THREE.Scene();
const gui = new GUI();

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
  // metalness: 0.3

})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

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
// const directionalLight = new THREE.DirectionalLight(0xffffff);
// directionalLight.position.set(0, 1, 1);
// directionalLight.target = sphere;
// gui.add(directionalLight.position, "x", 0, 10, 0.01)
// gui.add(directionalLight.position, "y", 0, 10, 0.01)
// gui.add(directionalLight.position, "z", 0, 10, 0.01)

// 设置聚光灯
// const spotLight = new THREE.SpotLight(0xffffff);
// spotLight.position.set(10, 10, 10);
// spotLight.angle = Math.PI / 2;
// gui.add(spotLight.position, "x", 0, 100, 0.01)
// gui.add(spotLight.position, "y", 0, 100, 0.01)
// gui.add(spotLight.position, "z", 0, 100, 0.01)
// gui.add(spotLight, "angle", 0, Math.PI / 2, 0.01)

const ballGeometry = new THREE.SphereGeometry(0.5, 30, 30);
const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })

const lightBall = new THREE.Mesh(ballGeometry, ballMaterial);

const pointLight = new THREE.PointLight(0xff0000, 0.5, 0, 0);
// pointLight.position.set(5, 5, 5);

lightBall.add(pointLight);

lightBall.position.set(0, 0, 6);

gui.add(lightBall.position, 'z', 0, 10, 0.1)

renderer.setSize(window.innerWidth, window.innerHeight);


// 开启渲染器光阴影计算
renderer.shadowMap.enabled = true;
// 设置平行光投影
// directionalLight.castShadow = true;
// 设置聚光灯投影

// 设置物体投射阴影
sphere.castShadow = true;
// 设置物体接收阴影
plane.receiveShadow = true;

scene.add(renderer);
scene.add(camera);
scene.add(sphere);
scene.add(plane);
scene.add(light);
// scene.add(directionalLight);
// scene.add(spotLight);
// scene.add(pointLight);
scene.add(lightBall)

control.update();

(function ani() {
  requestAnimationFrame(ani);

  renderer.render(scene, camera);
  control.update();
})()