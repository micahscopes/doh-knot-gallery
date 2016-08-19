import THREE from 'three'
import riot from 'riot'

export const SceneCameraMixin = {
  init: function(){
    this.on('before-mount', () => {
      this.setup();
      this.animate();
    })
    this.scene = new THREE.Scene();
  },
  setup: function() {
    this.trigger('initializaton-station');
    this.camera = new THREE.PerspectiveCamera( 70, this.root.clientWidth/this.root.clientHeight, 1, 1000 );
    this.camera.position.z = 400;
    if (this.root.tagName == "CANVAS"){
      this.canvas = this.root;
    }
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true, alpha:true});
    this.renderer.setPixelRatio( window.devicePixelRatio );
    if (this.root != this.renderer.domElement){
      this.root.appendChild( this.renderer.domElement );
      this.canvas = this.renderer.domElement;
    }
  },
  animate: function(){
    let canvas = this.renderer.domElement;
    if (this.lastWidth != canvas.clientWidth || this.lastHeight != canvas.clientHeight) {
      this.renderer.setSize( canvas.clientWidth, canvas.clientHeight, false);
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }
    window.requestAnimationFrame( this.animate );
    this.trigger('animate',this);
    this.renderer.render( this.scene, this.camera );
  },
}

export const ClickZoomMixin = {
  init: function() {
    var self = this;
    this.root.addEventListener('click',function(e){
      window.requestAnimationFrame(()=>self.trigger('zoom'));
    });
    this.on('zoom',this.zoom);
    riot.route(function(hash){
      if(hash==""){ self.trigger('unzoom') }
    });
    this.on('unzoom',this.unzoom);
    window.addEventListener('keyup',function(k){
      if(k.code == 'Escape') {
        location.hash=""
      }
    });
  },
  zoom: function(){
    location.hash = "zoomed"
    this.root.classList.add("zoomed")
  },
  unzoom: function(){
    this.root.classList.remove("zoomed")
  },
  isZoomed: function(){
    return this.root.classList.contains('zoomed');
  }
}

export const TurntableMixin = {
  init: function(){
    var self = this;
    if (this.onRotation == undefined){
      this.onRotation = [];
    }
    let dRot = self.dRotation = new THREE.Vector3;
    dRot.y = 0.02;

    this.on('mount',function(){
      self.rotate();
    })
    window.addEventListener('keyup',function(k){
      // if this object also mixes in the zoom module, then
      // only pause/unpause when zoomed
      if(k.key == " " && (self.isZoomed() || !self.isZoomed)){
         self.pauseRotation = !self.pauseRotation
       }
    })
  },
  rotate: function(objs){
    window.requestAnimationFrame(this.rotate);
    var dRot = this.dRotation;
    for (var o of this.onRotation) {
      if(o.rotation && !this.pauseRotation){
        o.rotation.x += dRot.x;
        o.rotation.y += dRot.y;
        o.rotation.y += dRot.z;
      }
    }
  }
}
