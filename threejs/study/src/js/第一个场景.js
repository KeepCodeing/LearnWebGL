import * as THREE from "three";

// 1. 创建一个场景
const scene = new THREE.Scene();

// 2. 创建摄像机，这里使用的是透视摄像机
// 参数1：FOV(视野长度)，以角度作为单位，这是因为我们的相机视野实际上
// 是一个锥形，这个角度就是这个锥形顶点的角度大小，越大看到的东西就越多
// 参数2：长宽比，用来适配物体大小，在较小屏幕下会被压缩，也可以通过这个
// 控制分辨率
// 参数3：近截面，表示相机距离物体多近时停止渲染
// 参数4：远截面，表示相机距离物体多远时停止渲染，这个参数可以一定程度优化性能
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器（canvas）的宽高
renderer.setSize(window.innerWidth, window.innerHeight);
// 将渲染器加入到HTML中
// 渲染器本质上是一个对象，里面用canvas作为画布，所以要将canvas加入到页面中
// 才能看到渲染效果
document.body.appendChild(renderer.domElement);

// 初始化一个正方形，指定它的长宽高（三维）
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 初始化一个材质，这是three.js中一个基本材质，这里只指定了颜色
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// 将正方形和材质合成成网格对象，可将网格对象放入场景使用
const cube = new THREE.Mesh(geometry, material);

// 把正方形放到场景里
scene.add(cube);

// 默认情况下相机位置是0,0,0，上面的正方形也是，这时会产生重叠
// 所以可以简单的指定下相机的z轴位置防止重叠
camera.position.z = 5;

// 默认情况下调用一次render只会渲染一次，所以我们要用
// 下面的方法根据用户屏幕帧率不断进行渲染
function animate() {
  requestAnimationFrame(animate);

  // x，y轴移动动画
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
