import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
import { ImprovedNoise } from 'https://unpkg.com/three/examples/jsm/math/ImprovedNoise.js';

let container;

let camera, controls, scene, renderer;

let position = 0;

const worldWidth = 300, worldDepth = 300;
const worldHalfWidth = worldWidth / 2;
const worldHalfDepth = worldDepth / 2;
const data = generateHeight( worldWidth, worldDepth );

const clock = new THREE.Clock();

init();
animate();

function init() {
    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 5000;
    camera.position.z = worldHalfWidth * 100;

    scene = new THREE.Scene();

    // sides
    const matrix = new THREE.Matrix4();

    const pyGeometry = new THREE.PlaneGeometry( 100, 100 );
    pyGeometry.rotateX( - Math.PI / 2 );
    pyGeometry.translate( 0, 50, 0 );

    const py2Geometry = new THREE.PlaneGeometry( 100, 100 );
    py2Geometry.rotateX( - Math.PI / 2 );
    py2Geometry.rotateY( Math.PI / 2 );
    py2Geometry.translate( 0, 50, 0 );

    let geometry = new THREE.Geometry();

    for ( let z = 0; z < worldDepth; z ++ ) {
        for ( let x = 0; x < worldWidth; x ++ ) {

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
    }

    geometry = new THREE.BufferGeometry().fromGeometry( geometry );
    let wireframe = new THREE.WireframeGeometry( geometry );
    let lines = new THREE.LineSegments( wireframe );

    scene.add( lines );

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
    render();
}

function render() {
    controls.update();
    renderer.render( scene, camera );
}