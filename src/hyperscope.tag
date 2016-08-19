import 'riot'
import THREE from 'three'
import {SceneCameraMixin, ClickToOpenMixin} from './mixins.js'

<random-torus>
  <script>
    this.mixin(SceneCameraMixin);
    this.mixin(ClickToOpenMixin);
    console.log("random torus");
    const name = 'random-torus';
    var self = this;
    let dRot = self.dRotation = new THREE.Vector3;
    dRot.x = 0.01; dRot.y = 0.02; dRot.z = 0.03;
    this.on('mount', () => {
      self.mesh = new THREE.Mesh();
      this.scene.add(self.mesh);
      self.updateGeometry();
      self.updateTexture();

      dRot.x *= Math.random()+0.5;
      dRot.y *= Math.random()+0.5;
      dRot.y *= Math.random()+0.5;

      rotate();
    });

    self.updateGeometry = function(geometry){
      if (geometry != undefined){
        self.mesh.geometry = geometry;
      } else {
        r1 = Math.floor(Math.random()*3+1)
        r2 = Math.floor(Math.random()*4+1)
        self.mesh.geometry = new THREE.TorusKnotGeometry(100,15,256,45,r1,r2);
      }
    }
    self.updateTexture = function(texture){
      let src = self.root.getAttribute('data-texture');
      if (texture != undefined){
        self.mesh.material.map = texture;
      } else if (src != undefined) {
        let textureLoader = new THREE.TextureLoader();
        textureLoader.load(src,function(t){
          self.mesh.material = new THREE.MeshBasicMaterial( { map: t } );
        });
      }
    }

    function rotate() {
      requestAnimationFrame(rotate);
      self.mesh.rotation.x += dRot.x;
      self.mesh.rotation.y += dRot.y;
      self.mesh.rotation.y += dRot.z;
    }

  </script>
  <style scoped>
    :scope {
      display: block;
      width: 200px;
      height: 200px;
    }
    .zoomed:scope {
      position: absolute;
      width:100%;
      height:100%;
      top: 0;
      left: 0;
      background: none;
    }
  </style>
</random-torus>
