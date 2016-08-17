import THREE from 'three'
import ERS from 'element-resize-detector'

<hyperscope>
  <script>
    const name = 'hyperscope'
    var hs = this;
    var resizeDetector = ERS();
    this.on('mount', () => {
      init();
      animate();
    })

    // setup three.js scene
    var camera, scene, renderer;
    hs.scene = new THREE.Scene();
    hs.mesh = new THREE.Mesh();

    hs.scene.add(hs.mesh);

    hs.updateGeometry = function(geometry){
      if (geometry != undefined){
        hs.mesh.geometry = geometry;
      } else {
        hs.mesh.geometry = new THREE.TorusKnotGeometry(100,25,128,45);
      }
    }
    hs.updateTexture = function(texture){
      if (texture != undefined){
        hs.mesh.material.map = texture;
      } else {
      let textureLoader = new THREE.TextureLoader();
      let src = hs.root.getAttribute('data-texture');
      textureLoader.load(src,function(t){
        hs.mesh.material = new THREE.MeshBasicMaterial( { map: t } );
      });
      }
    }

    function init() {
      console.log(this);
      let root = hs.root
      camera = new THREE.PerspectiveCamera( 70, root.clientWidth/root.clientHeight, 1, 1000 );
      camera.position.z = 400;
      hs.updateGeometry();
      hs.updateTexture();

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

      hs.mesh.rotation.x += 0.01;
      hs.mesh.rotation.y += 0.01;

      renderer.render( hs.scene, camera );
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
