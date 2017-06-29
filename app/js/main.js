window.THREE = require('three');

var AudioData = require('./views/audioData');
var Debugger = require('./views/debugger');
var Dataviz = require('./views/dataViz');


var App = function() {
	
	this.containerEl = document.getElementById('main');

	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : true } );

	this.containerEl.appendChild( this.renderer.domElement );

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera( );
	
	this.audioData = new AudioData( this );
	this.debugger = new Debugger( this );
	this.dataViz = new Dataviz( this );

	this.firstResize = true;

	document.addEventListener( 'resize', this.resize.bind( this ) );
	document.addEventListener( 'click', this.click.bind( this ) );

	this.resize(); 

	this.step();
}

App.prototype.resize = function(e) {
	this.renderer.setSize( this.containerEl.offsetWidth * 2, this.containerEl.offsetHeight * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + this.containerEl.offsetWidth + 'px; height:' + this.containerEl.offsetHeight + 'px' );
	this.camera.left = this.containerEl.offsetWidth / - 2;
	this.camera.right = this.containerEl.offsetWidth / 2;
	this.camera.top = this.containerEl.offsetHeight / 2;
	this.camera.bottom = this.containerEl.offsetHeight / - 2;
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix();
	clearTimeout( this.resizeStart );
	if( !this.firstResize ) this.resizeStart = setTimeout( this.onResizeEnd.bind(this), 400 );
	this.firstResize = false;
}

App.prototype.click = function( ) {
	this.audioData.playPause();
}

App.prototype.onResizeEnd = function(e) {
	
}

App.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );
	this.audioData.step( time );
	this.debugger.step( time );
	this.dataViz.step( time );
	this.renderer.render( this.scene, this.camera );
};

var app = new App();