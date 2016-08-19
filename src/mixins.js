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

export const ClickToOpenMixin = {
  init: function() {
    try {riot.observable(window)} catch(TypeError){}
    window.onkeyup = function(k){window.trigger('keyup',k)}
    var self = this;
    this.root.onclick = function(e){
      self.trigger('click',e)
    }
    this.on('click', function() {
        self.trigger('zoom');
    });
    this.on('zoom',function(){
      location.hash = "zoomed"
      self.root.classList.add("zoomed")
    })
    riot.route(function(hash){
      if(hash==""){ self.trigger('unzoom') }
    });
    this.on('unzoom',function(){
      self.root.classList.remove("zoomed")
    })
    window.on('keyup',function(k){
      if(k.code == 'Escape') {
        location.hash=""
      }
    });
  },
  isZoomed: function(){
    return this.root.classList.contains('zoomed');
  }
}

// export { ClickToOpenMixin, SceneCameraMixin };
