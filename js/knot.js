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
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

window.addEventListener( 'resize', onWindowResize, false );

// geometry
const n = 100;
const w = 1;
const speed = 0.00001 * randint(3, 10);
const scale = 1.2;

var lines = [];
for (let i = 0; i < n; i++){
    var t = 2 * Math.PI * i/(n-1);

    var geometry = new THREE.CubeGeometry(w, w, w);
    var wireframe = new THREE.WireframeGeometry( geometry );
    lines[i] = new THREE.LineSegments( wireframe );

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

// knot variables
const a1 = randrange(0, 5);
const a2 = randrange(0, 5);
const a3 = randrange(0, 5);
const b1 = randrange(0, 5);
const b2 = randrange(0, 5);
const b3 = randrange(0, 5);
const c1 = randrange(0, 5);
const c2 = randrange(0, 5);
const c3 = randrange(0, 5);
const d1 = randrange(0, 5);
const d2 = randrange(0, 5);
const d3 = randrange(0, 5);

function animate() {
    requestAnimationFrame( animate );

    const r = Date.now() * speed;

    // x = sin(t) + 2sin(2t)
    // y = cos(t) - 2cos(2t)
    // z =-sin(3t)

    for (let i = 0; i < n; i++){
        var t = 2 * Math.PI * i/(n-1) + r;

        lines[i].position.x = scale * (a1 * Math.sin(t) + b1 * Math.sin(2 * t) + c1 * Math.cos(t) + d1 * Math.cos(2 * t));
        lines[i].position.y = scale * (a2 * Math.sin(t) + b2 * Math.sin(2 * t) + c2 * Math.cos(t) + d2 * Math.cos(2 * t));
        lines[i].position.z = scale * (a3 * Math.sin(t) + b3 * Math.sin(3 * t) + c3 * Math.cos(t) + d3 * Math.cos(2 * t));
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

function randrange(a, b){
    return a + Math.random() * (b - a);
}

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    controls.update();

    renderer.setSize( window.innerWidth, window.innerHeight );

}