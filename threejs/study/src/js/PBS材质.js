import * as THREE from 'three';
import { OrbitControls } from './OrbitControls'

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();

const axeHelper = new THREE.AxesHelper(10);

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("texture/hardwood2_diffuse.jpg");

const outdoorTexture = textureLoader.load("texture/outdoor.jpg")
outdoorTexture.mapping = THREE.EquirectangularReflectionMapping;

scene.background = outdoorTexture;

texture.onLoad = function () {

}

texture.onProgress = function () {

}

texture.onError = function () {

}


const control = new OrbitControls(camera, renderer.domElement);

const light = new THREE.AmbientLight(0x404040);

const geometry = new THREE.SphereGeometry(3, 32, 16);
// const material = new THREE.MeshStandardMaterial({ map: texture });
const material = new THREE.MeshStandardMaterial({ map: outdoorTexture });
const sphere = new THREE.Mesh(geometry, material);
sphere.position.y = 3;

const geometryPlane = new THREE.PlaneGeometry(10, 10);
const materialPlane = new THREE.MeshBasicMaterial({ color: 0x3e3e3e, side: THREE.DoubleSide });
const plane = new THREE.Mesh(geometryPlane, materialPlane);
plane.position.y = -1;
plane.rotation.set(Math.PI / 2, 0, 0)

camera.position.z = 10;

scene.add(camera);
scene.add(axeHelper);
scene.add(light);
scene.add(plane);
scene.add(sphere);

control.update();

(function ani() {
  requestAnimationFrame(ani);

  renderer.render(scene, camera);
  control.update();
})()