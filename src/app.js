import './app.css';

import qs from 'qs';

function findFileName (url) {
    const lastSlash = url.lastIndexOf('/');
    if (lastSlash > -1) {
        return url.substring(lastSlash + 1);
    }
    return url;
}

const query = qs.parse(location.search, { ignoreQueryPrefix: true });

const src = query.src || '';

document.title = findFileName(src);

import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new Three.Scene();
scene.background = new Three.Color(0xdddddd);

const camera = new Three.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);

camera.rotation.x = -0.38;
camera.rotation.y = 0.17;
camera.rotation.z = 0.05;

camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 25;

const renderer = new Three.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// const hlight = new THREE.AmbientLight(0x404040, 10);
// scene.add(hlight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 100);
// directionalLight.position.set(0, 1, 0);
// directionalLight.castShadow = true;
// scene.add(directionalLight);

const light = new Three.PointLight(0xc4c4c4, 1);
light.position.set(0, 300, 500);
scene.add(light);

const light2 = new Three.PointLight(0xc4c4c4, 1);
light2.position.set(500, 100, 0);
scene.add(light2);

const light3 = new Three.PointLight(0xc4c4c4, 1);
light3.position.set(0, 100, -500);
scene.add(light3);

const light4 = new Three.PointLight(0xc4c4c4, 1);
light4.position.set(-500, 300, 500);
scene.add(light4);

const light5 = new Three.PointLight(0xc4c4c4, 1);
light5.position.set(0, 0, 0);
scene.add(light5);

const loader = new GLTFLoader();
loader.load(src, function (gltf) {
    const model = gltf.scene.children[0];
    scene.add(gltf.scene);
    animate();
});

const controls = new OrbitControls(camera, renderer.domElement);
// controls.addEventListener('change', e => {
//     console.log(e);
// })

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

window.addEventListener('resize', e => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}, { passive: true });