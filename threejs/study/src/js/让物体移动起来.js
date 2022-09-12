import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "./OrbitControls";
import dat from "dat.gui";

const scene = new THREE.Scene();

// 添加辅助轴线
const axeHelper = new THREE.AxesHelper(10);
scene.add(axeHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const cube = new THREE.Mesh(geometry, material);

const controls = new OrbitControls(camera, renderer.domElement);

scene.add(cube);

camera.position.z = 5;
controls.update();

const gui = new dat.GUI();

gui.add(cube.position, "x", 0, 10, 0.1).name("X轴移动");
gui
  .add(cube.rotation, "y")
  .min(0)
  .max(2 * Math.PI)
  .step(0.1)
  .name("Y轴旋转");

window.addEventListener("resize", () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 设置渲染器的像素比（适配多种分辨率）
  renderer.setPixelRatio(window.devicePixelRatio);
});

window.addEventListener("dblclick", () => {
  const fullScreenEle = document.fullscreenElement;

  // 存在全屏元素，就说明处于全屏状态
  if (fullScreenEle) document.exitFullscreen();
  // 否则将canvas设置为全屏
  renderer.domElement.requestFullscreen();
});

function animate() {
  // 修改物体x坐标位置
  // cube.position.x += 0.01;
  // if (cube.position.x > 10) cube.position.x = 0;

  // 缩放x轴
  // cube.scale.x = 2;

  // 旋转x轴，这里单独设置其它轴默认不为0，会出现奇怪的效果
  // cube.rotateX(Math.PI / 4);，Math.PI表示旋转360度，那么45度就是PI / 4
  // order可以不指定，默认就是xyz
  // cube.rotation.set(Math.PI / 4, 0, 0, "XYZ");

  // gsap.to(cube.position, {
  //   duration: 2,
  //   x: 10,
  //   // 无限循环
  //   repeat: -1,
  //   // 反复进行
  //   yoyo: true,
  // });

  // gsap.to(cube.rotation, {
  //   duration: 2,
  //   x: 2 * Math.PI,
  //   repeat: -1,
  //   yoyo: true,
  // });

  controls.update();

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

animate();
