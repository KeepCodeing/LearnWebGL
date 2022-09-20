// 一个练习，大概会结合场景嵌套摄像机和灯光...

import * as THREE from 'three'
import { OrbitControls } from './OrbitControls';
import * as GUI from 'dat.gui'
import gsap from "gsap";

const scene = new THREE.Scene()
// scene.background = 0xfff

const gui = new GUI.GUI();

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;

const axeHelper = new THREE.AxesHelper(10000);
scene.add(axeHelper);

// cameraHelper：这玩意需要两台相机，一台展示场景，一台只是用来展示视锥...
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const cameraControll = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 3, 50);
camera.lookAt(0, 0, 0);
camera.rotation.set(Math.PI / 2, 0, 0);

{
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 50, 0);
  camera.lookAt(0, 0, 0);
  const cameraHelper = new THREE.CameraHelper(camera);
  scene.add(cameraHelper);
}

// 注意点：有些对象，例如环境灯光，一般而言是不会有任何改变的，如果我们直接用块级作用域声明
// 那是没问题的。但是有的对象是需要动态设置参数的，这时封装一个函数就会比较合理了。
{
  const light = new THREE.AmbientLight(0x404040, 1);
  scene.add(light);
}

function addDirectionLight(pos = [0, 10, 10], targetPos = [0, 0, 0]) {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(...pos);
  directionalLight.target.position.set(...targetPos);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // const helper = new THREE.DirectionalLightHelper(directionalLight);
  // scene.add(helper);
  // 玩了会尝试把直射光的正交摄像机视锥改成能覆盖地图的，不过果然出现了教程里的
  // 模糊问题，而且设置大小很麻烦，所以还不如换个位置再把元素变小...
  const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
  // directionalLight.shadow.camera.left = 50;
  // directionalLight.shadow.camera.right = -50;
  // directionalLight.shadow.camera.updateProjectionMatrix();


  scene.add(cameraHelper);

  return directionalLight;
}

// 感觉直射光在这里没有聚光灯好用...
function addSpotLight() {
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 30, 0);
  // spotLight.map = new THREE.TextureLoader().load(url);

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 0.1;
  spotLight.shadow.camera.far = 100;
  spotLight.shadow.camera.fov = 75;

  scene.add(spotLight);

  return spotLight;
}

const spotLight = addSpotLight()
gui.add(spotLight.position, 'x', 0, 100, 0.1).name('lightX');
gui.add(spotLight.position, 'y', 0, 100, 0.1).name('lightY');
gui.add(spotLight.position, 'z', 0, 100, 0.1).name('lightZ');
// addDirectionLight();

function createElement(geometry, materialParmas = { color: 0x3f3f3f, side: THREE.DoubleSide }, shadow = true) {
  // 因为要有阴影什么的就默认标准材质了
  const material = new THREE.MeshStandardMaterial(materialParmas);
  const ele = new THREE.Mesh(geometry, material);
  ele.castShadow = shadow
  scene.add(ele);

  return ele;
}

const plane = createElement(new THREE.PlaneGeometry(50, 50), { color: 0x3f3f3f, side: THREE.DoubleSide }, false);
plane.rotation.set(Math.PI / 2, 0, 0);
plane.receiveShadow = true;

// const sphere = createElement(new THREE.SphereGeometry(5));
// sphere.castShadow = true;
// sphere.position.set(0, 5, 0);

// 来想想车又那些部分组成，或者说想要什么形状：
// 首先是车场景部分，这是一整个场景，下面所有东西都是其子场景，通过这个场景能控制
// 车的移动。
// 其次是车身，这块最好能分成三个部分，也就是三个锥形，拼成一种车体的感觉，如果可以
// 再加个五个车窗。细分这部分就是车身场景。
// 最后是车轮，这部分属于车身，但是它又可以被单独做成一个场景，这样可以给车轮场景加上
// 旋转动画而不影响车身。

// 一个空的对象用来表示车的场景
const carScence = new THREE.Object3D();

// 车上方
const carTop = createElement(new THREE.CylinderGeometry(5, 7, 3, 4));
carTop.position.y = 5;
carTop.rotation.set(0, Math.PI / 4, 0);
carScence.add(carTop);

// 车身
const carBody = createElement(new THREE.BoxGeometry(10, 3, 20));
carBody.position.y = 2;
carScence.add(carBody);

function createLights() {
  const points = [[-3, 2, 10], [3, 2, 10]];
  return Array.from({ length: 2 }, (_, i) => {
    const ele = createElement(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 10, 10), { color: 0xffffff });
    ele.rotation.set(Math.PI / 2, 0, 0);
    ele.position.set(...points[i]);

    carScence.add(ele);

    return ele;
  })
}

// 只在车头加车灯，用来表示方向
const carLight = createLights();

// 车轮
const wheels = new THREE.Object3D();

function createWheels() {
  const textureLoader = new THREE.TextureLoader();
  const aoTexture = textureLoader.load('texture/MetalPlateStudded001/MetalPlateStudded001_AO_2K_METALNESS.png');
  const bumpTexture = textureLoader.load('texture/MetalPlateStudded001/MetalPlateStudded001_BUMP_2K_METALNESS.png');
  const normalMap = textureLoader.load('texture/MetalPlateStudded001/MetalPlateStudded001_NRM_2K_METALNESS.png');

  // 车轮上再加上六个螺丝，突出动效
  // 想了想比较麻烦，不如把车轮颜色或者材质改改
  return Array.from({ length: 4 }, (_, i) => {
    const points = [[-5, 0, -5], [5, 0, 5], [-5, 0, 5], [5, 0, -5]]
    const ele = createElement(new THREE.CylinderGeometry(2, 2, 2, 20, 20), {
      metalness: 0.7,
      aoMap: aoTexture,
      bumpMap: bumpTexture,
      normalMap: normalMap
    });

    ele.uv2 = ele.geometry.attributes.uv;
    ele.rotation.set(Math.PI / 2, 0, Math.PI / 2);
    ele.position.set(...points[i]);

    wheels.add(ele);

    return ele;
  });
}

function updateCar(time) {
  carScence.position.x = Math.sin(time);
  carScence.position.z = 10 * Math.cos(time);
}

const carWheels = createWheels()

carScence.add(wheels);

carScence.position.set(0, 2, 0);

scene.add(carScence);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

function updateWheels(time) {
  for (const item of carWheels) {
    item.rotation.x += time;
  }
}

const clock = new THREE.Clock();
(function ani() {

  renderer.render(scene, camera);
  cameraControll.update();

  const deltaTime = clock.getDelta();

  updateWheels(deltaTime);

  updateCar(clock.elapsedTime);

  requestAnimationFrame(ani);
})();