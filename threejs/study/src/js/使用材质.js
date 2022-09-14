import * as THREE from "three";
import { OrbitControls } from "./OrbitControls";

const scene = new THREE.Scene();

const axeHelper = new THREE.AxesHelper(10);

scene.add(axeHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const texture = new THREE.TextureLoader().load("texture/hardwood2_diffuse.jpg");

const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial({ map: texture });

const cube = new THREE.Mesh(geometry, material);

const orbitCOntrol = new OrbitControls(camera, renderer.domElement);

scene.add(camera);

scene.add(cube);

orbitCOntrol.update();

(function ani() {
  requestAnimationFrame(ani);

  orbitCOntrol.update();
  renderer.render(scene, camera);
})();
