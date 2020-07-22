import 'normalize.css';
import './app.css';

import qs from 'qs';

import { Scene, Color, PerspectiveCamera, WebGLRenderer, AmbientLight, PointLight, Object3D, Box3, Vector3 } from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function findFileName (url: string) {
    const lastSlash = url.lastIndexOf('/');
    if (lastSlash > -1) {
        return url.substring(lastSlash + 1);
    }
    return url;
}

function fitCameraToObject (camera: PerspectiveCamera, object: Object3D, offset: number = 1.25, controls?: OrbitControls) {
    // get bounding box of object - this will be used to setup controls and camera
    const boundingBox = new Box3();
    boundingBox.setFromObject(object);

    const center = boundingBox.getCenter(new Vector3());
    const size = boundingBox.getSize(new Vector3());

    // get the max side of the bounding box (fits to width OR height as needed )
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));

    cameraZ *= offset; // zoom out a little so that objects don't fill the screen

    camera.position.set(center.x, center.y, cameraZ);

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

    camera.far = cameraToFarEdge * 3;
    camera.updateProjectionMatrix();

    if (controls) {
        // set camera to rotate around center of loaded object
        controls.target = center;
        // prevent camera from zooming out far enough to create far plane cutoff
        controls.maxDistance = cameraToFarEdge * 2;
        controls.saveState();
    } else {
        camera.lookAt(center);
    }
}

async function loadGTFL (loader: GLTFLoader, src: string): Promise<GLTF> {
    return await new Promise<GLTF>(resolve => {
        loader.load(src, gltf => {
            resolve(gltf);
        });
    });
}

async function main () {
    const { src } = qs.parse(location.search, { ignoreQueryPrefix: true }) as { [key: string]: string };

    document.title = findFileName(src);

    const scene = new Scene();
    scene.background = new Color(0xeeeeee);

    const camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const hlight = new AmbientLight(0x404040, 1);
    scene.add(hlight);

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 100);
    // directionalLight.position.set(0, 1, 0);
    // directionalLight.castShadow = true;
    // scene.add(directionalLight);

    const light = new PointLight(0xc4c4c4, 1);
    light.position.set(0, 300, 500);
    scene.add(light);

    const light2 = new PointLight(0xc4c4c4, 1);
    light2.position.set(500, 100, 0);
    scene.add(light2);

    const light3 = new PointLight(0xc4c4c4, 1);
    light3.position.set(0, 100, -500);
    scene.add(light3);

    const light4 = new PointLight(0xc4c4c4, 1);
    light4.position.set(-500, 300, 500);
    scene.add(light4);

    const light5 = new PointLight(0xc4c4c4, 1);
    light5.position.set(0, 0, 0);
    scene.add(light5);

    const controls = new OrbitControls(camera, renderer.domElement);

    function animate () {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }, { passive: true });

    const loader = new GLTFLoader();
    const gltf = await loadGTFL(loader, src);

    const model = gltf.scene.children[0];
    scene.add(gltf.scene);
    fitCameraToObject(camera, model, 1, controls);
    animate();
}

main();