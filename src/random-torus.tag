import THREE from 'three'
import ERS from 'element-resize-detector'

<random-torus>
  <canvas name="canvas" data-is="scene-camera"></canvas>
  <script>
    console.log("random torus")
    const name = 'random-torus';
    var self = this;
    sc = self.canvas._tag;
    let dRot = self.dRotation = new THREE.Vector3;
    dRot.x = 0.01; dRot.y = 0.02; dRot.z = 0.03;
    sc.on('mount', () => {
      self.mesh = new THREE.Mesh();
      sc.scene.add(self.mesh);
      self.updateGeometry();
      self.updateTexture();

      dRot.x *= Math.random()+0.5;
      dRot.y *= Math.random()+0.5;
      dRot.y *= Math.random()+0.5;

      animate();
    });
    self.root.onclick = function(e){
      self.updateGeometry();
    }

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

    function animate() {
      requestAnimationFrame(animate);
      self.mesh.rotation.x += dRot.x;
      self.mesh.rotation.y += dRot.y;
      self.mesh.rotation.y += dRot.z;
    }

  </script>
</random-torus>
