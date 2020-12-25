import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

// setup
const container = document.getElementById( 'container' );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

container.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

window.addEventListener( 'resize', onWindowResize, false );

// geometry
const n = randint(5, 100);
const w = 1;
const speed = 0.0001 * randint(1, 10);

var lines = [];
for (let i = 0; i < n; i++){
    var geometry = new THREE.BoxGeometry(w, w, w);
    var wireframe = new THREE.WireframeGeometry( geometry );
    lines[i] = new THREE.LineSegments( wireframe );
    lines[i].position.x = w * (i - Math.floor(n / 2));
    lines[i].material.depthTest = false;
    lines[i].material.opacity = 0.5;
    lines[i].material.transparent = true;
    scene.add(lines[i]);
}

// update camera
camera.position.x = (Math.random() - 0.5) * n * w / 2;
camera.position.y = (Math.random() - 0.5) * n * w / 2;
camera.position.z = (Math.random() - 0.5) * n * w / 2;
controls.update();

function animate() {
    requestAnimationFrame( animate );

    const r = Date.now() * speed;

    for (let i = 0; i < n; i++){
        lines[i].position.y = Math.log(n) * Math.sin(2 * Math.PI * (i / n) + r);
        lines[i].position.z = Math.log(n) * Math.cos(2 * Math.PI * (i / n) + r);
        lines[i].rotation.x = Math.log(n) * Math.sin(2 * Math.PI * (i / n) + r);
    }
    
    controls.update();
    renderer.render( scene, camera );
}
animate();

function randint(a, b) {
    return a + Math.floor(Math.random() * (b - a));
}

function randbool() {
    return Math.random() < 0.5;
}

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    controls.update();

    renderer.setSize( window.innerWidth, window.innerHeight );

}