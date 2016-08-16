import THREE from 'three'
import ERS from 'element-resize-detector'

<hyperscope>
  <script>
    const name = 'hyperscope'
    this.content = `Hello **${ name }**!`
    var hyperscope = this;
    var camera, scene, renderer;
    var mesh;
    var resizeDetector = ERS();
    this.on('mount', () => {
      init();
      animate();
    })

    function init() {
      console.log(this);
      let root = hyperscope.root
      camera = new THREE.PerspectiveCamera( 70, root.clientWidth/root.clientHeight, 1, 1000 );
      camera.position.z = 400;

      scene = new THREE.Scene();

      var texture = new THREE.TextureLoader().load(hyperscope.root.getAttribute('data-texture'));

      var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
      var material = new THREE.MeshBasicMaterial( { map: texture } );

      mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );

      renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
      renderer.setPixelRatio( window.devicePixelRatio );
      // renderer.setSize(root.clientWidth,root.clientHeight);
      root.appendChild( renderer.domElement );

      resizeDetector.listenTo(root, function(){
        // update the canvas size, but don't change its css by passing false to setSize()
        renderer.setSize( renderer.domElement.clientWidth, renderer.domElement.clientHeight, false);
        // .
        camera.aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
        camera.updateProjectionMatrix();
      });
    }

    function animate() {

      requestAnimationFrame( animate );

      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.01;

      renderer.render( scene, camera );
    }

  </script>

  <style scoped>
    :scope {
      display: block;
      width: 200px;
      height: 200px;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  </style>
</hyperscope>
