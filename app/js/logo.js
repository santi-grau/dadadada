var Physics = require('./views/physics');
var AudioData = require('./views/audioData');
var Debugger = require('./views/debugger');
var Dataviz = require('./views/dataViz');

var Logo = function( element ){
	this.element = element;

	this.active = true;
	
	this.logoMargin = 0.06;

	this.firstResize = true;
	this.size = this.oldSize = [ this.element.offsetWidth, this.element.offsetHeight ];

	if(!window._DADADADA) window._DADADADA = {};

	var devicePixelRatio = window.devicePixelRatio || 1;

	this.canvas = document.createElement('canvas');
	this.element.append( this.canvas );
	
	this.canvas.width  = this.element.offsetWidth * devicePixelRatio;
	this.canvas.height = this.element.offsetHeight * devicePixelRatio;
	
	this.canvas.style.width = this.element.offsetWidth + "px";
	this.canvas.style.height = this.element.offsetHeight + "px";

	this.audioData = new AudioData( this );
	this.dataViz = new Dataviz( this );
	this.physics = new Physics( this );

	element.addEventListener( 'click', this.click.bind( this ) );
	window.addEventListener( 'scroll', this.scroll.bind( this ) );

	this.step();
	this.resize();
	// this.active = false;
	// this.checkActive();
}

Logo.prototype.checkActive = function( ) {
	// var elTop = this.element.offsetTop;
	// var elBot = elTop + this.element.offsetHeight;
	// var winTop = document.body.scrollTop;
	// var winBot = document.body.scrollTop + window.innerHeight;
	// if( ( elTop >= winTop && elTop < winBot ) || ( elBot > winTop && elBot < winBot ) ) this.active = true;
	// else this.active = false;
}

Logo.prototype.click = function( ) {
	this.audioData.playPause();
}

Logo.prototype.resize = function( ) {
	clearTimeout( this.resizeStart );
	if( !this.firstResize ) this.resizeStart = setTimeout( this.resizeEnd.bind(this), 400 );
	this.firstResize = false;
}

Logo.prototype.scroll = function( e ){
	this.checkActive();
}

Logo.prototype.resizeEnd = function( ) {

}

Logo.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );
	this.audioData.step( time );
	this.dataViz.step( time );
	this.physics.step( time );
	this.size = [ this.element.offsetWidth, this.element.offsetHeight ];
	if( this.oldSize[0] !== this.size[0] || this.oldSize[1] !== this.size[1] ) this.resize();
	this.oldSize = this.size;
}

module.exports = Logo;