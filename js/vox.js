import * as THREE from 'https://unpkg.com/three@0.119.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.119.0/examples/jsm/controls/OrbitControls.js';
import { ImprovedNoise } from 'https://unpkg.com/three@0.119.0/examples/jsm/math/ImprovedNoise.js';

class Spiral {
    x = 0; y = 0; i = 0; j = 0; N = 0; n = 0; c = 0;

    /* via https://oeis.org/A174344 */
    next(){
        if (this.n == 0) {
            this.c += 1;
            if (this.c > 3) this.c = 0;
    
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

const worldWidth = 200, worldDepth = 200;
const worldHalfWidth = worldWidth / 2;
const worldHalfDepth = worldDepth / 2;
const data = generateHeight( worldWidth, worldDepth );

let spiral = new Spiral();

init();
animate();

function init() {
    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 5000;
    camera.position.z = worldHalfWidth * 100;

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
        let geometry = new THREE.Geometry();
    
        for (let i=0; i<5; i++){
            // sides
            const matrix = new THREE.Matrix4();

            const pyGeometry = new THREE.PlaneGeometry( 100, 100 );
            pyGeometry.rotateX( - Math.PI / 2 );
            pyGeometry.translate( 0, 50, 0 );
        
            const py2Geometry = new THREE.PlaneGeometry( 100, 100 );
            py2Geometry.rotateX( - Math.PI / 2 );
            py2Geometry.rotateY( Math.PI / 2 );
            py2Geometry.translate( 0, 50, 0 );

            const x = spiral.x + worldWidth / 2; 
            const z = spiral.y + worldDepth / 2;
            const h = getY( x, z );

            matrix.makeTranslation(
                x * 100 - worldHalfWidth * 100,
                h * 100,
                z * 100 - worldHalfDepth * 100
            );

            const px = getY( x + 1, z );
            const nx = getY( x - 1, z );
            const pz = getY( x, z + 1 );
            const nz = getY( x, z - 1 );

            const pxpz = getY( x + 1, z + 1 );
            const nxpz = getY( x - 1, z + 1 );
            const pxnz = getY( x + 1, z - 1 );
            const nxnz = getY( x - 1, z - 1 );

            spiral.next();

            const a = nx > h || nz > h || nxnz > h ? 0 : 1;
            const b = nx > h || pz > h || nxpz > h ? 0 : 1;
            const c = px > h || pz > h || pxpz > h ? 0 : 1;
            const d = px > h || nz > h || pxnz > h ? 0 : 1;

            if ( a + c > b + d ) {
                geometry.merge( py2Geometry, matrix );
            } else {
                geometry.merge( pyGeometry, matrix );
            }
        }
    
        geometry = new THREE.BufferGeometry().fromGeometry( geometry );
        let wireframe = new THREE.WireframeGeometry( geometry );
        let lines = new THREE.LineSegments( wireframe );
    
        scene.add( lines );
    

    render();
}

function render() {
    controls.update();
    renderer.render( scene, camera );
}