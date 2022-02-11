import * as THREE from 'https://unpkg.com/three@0.119.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.119.0/examples/jsm/controls/OrbitControls.js';
import { ImprovedNoise } from 'https://unpkg.com/three@0.119.0/examples/jsm/math/ImprovedNoise.js';

class Spiral {
    x = 0; y = 0; i = 0; j = 0; N = 0; n = 0; c = 0;

    /* via https://oeis.org/A174344 */
    next(){
        if (this.n == 0) {
            this.c = (this.c + 1) % 4;
    
            if (this.c == 0) { this.i = 0; this.j = 1; }
            if (this.c == 1) { this.i = 1; this.j = 0; }
            if (this.c == 2) { this.i = 0; this.j =-1; }
            if (this.c == 3) { this.i =-1; this.j = 0; }
    
            if (this.c == 1 || this.c == 3) this.N += 1;
            this.n = this.N;
        }
    
        this.n -= 1;
        this.x += this.i;
        this.y += this.j;
    }
}

let container;
let camera, controls, scene, renderer;

const worldWidth = 500, worldDepth = 500;
const worldHalfWidth = worldWidth / 2;
const worldHalfDepth = worldDepth / 2;
const data = generateHeight( worldWidth, worldDepth );
const worldScale = 200

let spiral = new Spiral();
let count = 0;

init();
animate();

function init() {
    container = document.getElementById( 'canvas' );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, worldScale * 1000 );
    camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * worldScale + 10000;
    camera.position.z = worldHalfWidth * worldScale / 3;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    controls.update();
}

function generateHeight( width, height ) {
    const data = [];
    const perlin = new ImprovedNoise();
    const size = width * height;
    const z = Math.random() * 100;
    let quality = 2;
    for ( let j = 0; j < 4; j ++ ) {
        if ( j == 0 ) for ( let i = 0; i < size; i ++ ) data[ i ] = 0;
        for ( let i = 0; i < size; i ++ ) {
            const x = i % width, y = ( i / width ) | 0;
            data[ i ] += perlin.noise( x / quality, y / quality, z ) * quality;
        }
        quality *= 4;
    }

    return data;

}

function getY( x, z ) {
    return ( data[ x + z * worldWidth ] * 0.2 ) | 0;
}

function animate() {
    requestAnimationFrame( animate );

    if (count < data.length) {
        let geometry = new THREE.Geometry();

        for (let i=0; i<1; i++) {
            // sides
            const matrix = new THREE.Matrix4();

            const pyGeometry = new THREE.PlaneGeometry( worldScale, worldScale);
            pyGeometry.rotateX( - Math.PI / 2 );
            pyGeometry.translate( 0, worldScale / 2, 0 );

            const x = spiral.x + worldWidth / 2; 
            const z = spiral.y + worldDepth / 2;
            const h = getY( x, z );

            matrix.makeTranslation(
                (x - worldHalfWidth) * worldScale,
                h * worldScale,
                (z - worldHalfDepth) * worldScale
            );

            spiral.next();

            geometry.merge( pyGeometry, matrix );

            count += 1;
            if (count >= worldWidth * worldDepth)
                break;
        }

        geometry = new THREE.BufferGeometry().fromGeometry( geometry );
        let wireframe = new THREE.WireframeGeometry( geometry );
        let lines = new THREE.LineSegments( wireframe );

        scene.add( lines );
    }

    render();
}

function render() {
    controls.update();
    renderer.render( scene, camera );
}