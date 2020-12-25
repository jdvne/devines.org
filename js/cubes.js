import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById( 'container' );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const n = 5 + randint(95);
const w = 1;

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

camera.position.z = n * w / 2;

controls.update();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    controls.handleResize();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

const speed = 0.0001 * randint(10);

function animate() {
    requestAnimationFrame( animate );

    const r = Date.now() * speed;

    for (let i = 0; i < n; i++){
        lines[i].position.y = Math.log(n) * Math.sin(2 * Math.PI * (i / n) + r);
        lines[i].rotation.x = Math.log(n) * Math.sin(2 * Math.PI * (i / n) + r);
    }
    
    controls.update();

    renderer.render( scene, camera );
}
animate();

function randint(range) {
    return Math.floor(Math.random() * range);
}