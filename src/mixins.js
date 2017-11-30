import * as THREE from 'three'
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
    this.closeButton = document.createElement('a')
    this.closeButton.innerHTML = '&#10006;'
    var cbs = this.closeButton.style
    cbs.border = 'none';
    cbs.userSelect = 'none';
    cbs.top = 0;
    cbs.left = 0;
    cbs.position = 'fixed'
    cbs.fontSize = '4em'
    cbs.display = 'none'
    cbs.color = 'white'
    cbs.zIndex = 10001
    this.root.style.cursor = 'pointer'
    this.closeButton.classList.add('click-zoom-close-button')
    this.root.appendChild(this.closeButton)

    this.root.addEventListener('click',function(e){
      self.zoom();
    });
    window.addEventListener('keyup',function(k){
      if(k.code == 'Escape') {
        self.unzoom();
      }
    });

    this.closeButton.addEventListener('click', function(e) {
      self.unzoom();
      e.stopPropagation();
    });
  },
  zoom: function(){
    var self = this
    this.closeButton.style.display = 'flex'
    var rect = this.root.getBoundingClientRect()
    var s = this.canvas.style
    s.left = String(rect.left)+'px'
    s.top = String(rect.top)+'px'
    s.width = String(rect.width)+'px'
    s.height = String(rect.height)+'px'
    
    s.position = 'absolute'
    window.requestAnimationFrame(function(){
      s.position = 'fixed'
      self.root.style.zIndex = 5000
      s['transition-property'] = 'width, height, left, top, background-color'
      s['transition-duration'] = '0.5s'
      s.width = '100%'
      s.height = '100%'
      s.left = '0px'
      s.top = '0px'
      self.root.classList.add("zoomed")
    })
  },
  unzoom: function(){
    var self = this
    if (!this.isZoomed()) { return }
    var rect = this.root.getBoundingClientRect()
    var s = this.canvas.style
    
    //s.position = ''
    window.requestAnimationFrame(function(){
      s['transition-property'] = 'width, height, left, top, background-color'
      s['transition-duration'] = '0.5s'
      self.closeButton.style.display = 'none'
      s.left = String(window.scrollX + rect.left)+'px'
      s.top = String(window.scrollY + rect.top)+'px'
      s.width = String(rect.width)+'px'
      s.height = String(rect.height)+'px'
      s.position = 'absolute'
      self.root.classList.remove('zoomed');
      setTimeout(function(){
        s.left = ''
        s.top = ''
        s.width = ''
        s.height = ''
        s.position = ''
        s['transition-property'] = ''
        s['transition-duration'] = ''
        self.root.style.zIndex = 0
      },500)
    })

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
