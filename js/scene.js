import * as THREE from 'https://unpkg.com/three/build/three.module.js';
    import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const controls = new OrbitControls( camera, renderer.domElement );

    var lines = [];
    const num_cubes = 3;

    for (let i = 0; i < num_cubes; i++){
      var geometry = new THREE.BoxGeometry(2, 2, 2);
      var wireframe = new THREE.WireframeGeometry( geometry );
      lines[i] = new THREE.LineSegments( wireframe );
      lines[i].position.x = 2 * i - (num_cubes - 1);
      lines[i].material.depthTest = false;
      lines[i].material.opacity = 0.25;
      lines[i].material.transparent = true;
      scene.add(lines[i]);
    }

    controls.update();
    
    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize(){

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      controls.update();

      renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {
      requestAnimationFrame( animate );
      for (const line of lines){
        line.rotation.x += 0.01;
        line.rotation.y += 0.01;
      }

      controls.update();

      renderer.render( scene, camera );
    }
    animate();