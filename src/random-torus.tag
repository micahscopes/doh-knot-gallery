import THREE from 'three'
import {SceneCameraMixin,ClickToOpenMixin} from './mixins.js'

<random-torus>
  <script>
    this.mixin(SceneCameraMixin);
    this.mixin(ClickToOpenMixin);
    const name = 'random-torus';
    var self = this;
    let dRot = self.dRotation = new THREE.Vector3;
    dRot.y = 0.02;
    this.on('mount', () => {
      self.mesh = new THREE.Mesh();
      this.scene.add(self.mesh);
      self.updateGeometry();
      self.updateTexture();

      dRot.y *= Math.random()+0.5;

      rotate();
    });
    this.on('click',function(){
      if(self.isZoomed()){
        self.updateGeometry();
        self.updateTexture();
      }
    });
    self.updateGeometry = function(geometry){
      if (geometry != undefined){
        self.mesh.geometry = geometry;
      } else {
        var r1 = Math.floor(Math.random()*5)
        var r2 = r1
        while(r1 == r2){
          r2 = Math.floor(Math.random()*5)+1
        }
        console.log('using torus knot:',r1,r2)
        self.mesh.geometry = new THREE.TorusKnotGeometry(100,15,128,16,r1,r2);
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
    :scope.zoomed{
      position: fixed;
      width:100%;
      height:100%;
      top: 0;
      left: 0;
      margin: 0;
      padding: 0;
      border: none;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  </style>
</random-torus>
