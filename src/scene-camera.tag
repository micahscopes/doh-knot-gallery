import THREE from 'three'
import ERS from 'element-resize-detector'

<scene-camera>
  <script>
    const name = 'scene-camera'
    var self = this;
    var root = self.root;
    var resizeDetector = ERS();
    self.scene = new THREE.Scene();
    this.on('before-mount', () => {
      init();
      animate();
    })

    function init() {
      self.trigger('initializaton-station');
      self.camera = new THREE.PerspectiveCamera( 70, root.clientWidth/root.clientHeight, 1, 1000 );
      self.camera.position.z = 400;

      renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
      renderer.setPixelRatio( window.devicePixelRatio );
      root.appendChild( renderer.domElement );

      resizeDetector.listenTo(root, function(){
        // update the canvas size, but don't change its css by passing false to setSize()
        renderer.setSize( renderer.domElement.clientWidth, renderer.domElement.clientHeight, false);
        self.camera.aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
        self.camera.updateProjectionMatrix();
      });
    }

    function animate() {
      requestAnimationFrame( animate );
      self.trigger('animate',self);
      renderer.render( self.scene, self.camera );
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
</scene-camera>
