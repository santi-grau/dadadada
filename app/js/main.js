var Logo = require('./logo');

var App = function() {
	var logos = document.getElementsByClassName('dadadada');
	this.logos = [];
	for( var i = 0 ; i < logos.length ; i++ ) this.logos.push( new Logo( logos[i] ) );

	this.step();
}

App.prototype.resize = function(e) {
	clearTimeout( this.resizeStart );
	if( !this.firstResize ) this.resizeStart = setTimeout( this.onResizeEnd.bind(this), 400 );
	this.firstResize = false;
}

App.prototype.onResizeEnd = function(e) {
	
}

App.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );
};

var app = new App();