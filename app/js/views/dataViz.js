// var THREE = require('three');
var vertexShader = require('./../../shaders/vertex.glsl');
var fragmentShader = require('./../../shaders/fragment.glsl');
var Texture = require('./texture');

var Dataviz = function( parent ){
	this.parent = parent;
	this.time = 0;
	this.parameters = {  start_time : new Date().getTime(), time : 0, screenWidth : 0,  screenHeight: 0 };
 	
 	this.textureReady = false;

	this.gl = this.parent.canvas.getContext( 'experimental-webgl' );
	this.buffer = this.gl.createBuffer();
	this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.buffer );
	this.gl.bufferData( this.gl.ARRAY_BUFFER, new Float32Array( [ - 1.0, - 1.0, 1.0, - 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0 ] ), this.gl.STATIC_DRAW );
	this.currentProgram = this.createProgram( vertexShader, fragmentShader );
	this.scaleLocation = this.gl.getUniformLocation( this.currentProgram, 'scale' );
	this.timeLocation = this.gl.getUniformLocation( this.currentProgram, 'time' );
	this.resolutionLocation = this.gl.getUniformLocation( this.currentProgram, 'resolution' );
 	
 	if( !window.texture ) new Texture( this, 2048 );
	else this.makeTexture();

	this.resize();
}

Dataviz.prototype.makeTexture = function( ){

	var _this = this;
	this.texture = new Image();
	this.texture.onload = function () {
		_this.tex = _this.gl.createTexture();
		_this.gl.bindTexture( _this.gl.TEXTURE_2D, _this.tex);

		_this.gl.texParameteri(_this.gl.TEXTURE_2D, _this.gl.TEXTURE_WRAP_S, _this.gl.CLAMP_TO_EDGE);
		_this.gl.texParameteri(_this.gl.TEXTURE_2D, _this.gl.TEXTURE_WRAP_T, _this.gl.CLAMP_TO_EDGE);
		_this.gl.texParameteri(_this.gl.TEXTURE_2D, _this.gl.TEXTURE_MIN_FILTER, _this.gl.LINEAR);
		_this.gl.texParameteri(_this.gl.TEXTURE_2D, _this.gl.TEXTURE_MAG_FILTER, _this.gl.NEAREST);

		_this.textureReady = true;
	}
	this.texture.src = window.texture;
}

Dataviz.prototype.createProgram = function( vertex, fragment ){
	var program = this.gl.createProgram();
 
	var vs = this.createShader( vertex, this.gl.VERTEX_SHADER );
	var fs = this.createShader( '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment, this.gl.FRAGMENT_SHADER );

	this.gl.attachShader( program, vs );
	this.gl.attachShader( program, fs );

	this.gl.deleteShader( vs );
	this.gl.deleteShader( fs );

	this.gl.linkProgram( program );

	if ( !this.gl.getProgramParameter( program, this.gl.LINK_STATUS ) ) return console.log( "ERROR:\n" + "VALIDATE_STATUS: " + this.gl.getProgramParameter( program, this.gl.VALIDATE_STATUS ) + "\n" + "ERROR: " + this.gl.getError() + "\n\n" + "- Vertex Shader -\n" + vertex + "\n\n" + "- Fragment Shader -\n" + fragment );

	return program;
}

Dataviz.prototype.createShader = function( src, type ){
	var shader = this.gl.createShader( type );
	this.gl.shaderSource( shader, src );
	this.gl.compileShader( shader );
	if ( !this.gl.getShaderParameter( shader, this.gl.COMPILE_STATUS ) ) return console.log( ( type == this.gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT" ) + " SHADER:\n" + this.gl.getShaderInfoLog( shader ) );
	return shader;
}

Dataviz.prototype.render = function(){
	if ( !this.currentProgram ) return;
	this.parameters.time = new Date().getTime() - this.parameters.start_time;
	this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
	// Load program into GPU
	this.gl.useProgram( this.currentProgram );
 
	// Set values to program variables
	this.gl.uniform1f( this.timeLocation, this.parameters.time / 1000 );
	this.gl.uniform2f( this.resolutionLocation, this.parameters.screenWidth, this.parameters.screenHeight );

	// this.gl.bindTexture( this.gl.TEXTURE_2D, this.texture);
	this.gl.texImage2D( this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.texture );
 
	// Render geometry
	this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.buffer );
	this.gl.vertexAttribPointer( this.vertex_position, 2, this.gl.FLOAT, false, 0, 0 );
	this.gl.enableVertexAttribArray( this.vertex_position );
	this.gl.drawArrays( this.gl.TRIANGLES, 0, 6 );
	this.gl.disableVertexAttribArray( this.vertex_position );
}

Dataviz.prototype.resize = function(){
	var dpr = window.devicePixelRatio || 1;
	this.parent.canvas.width = this.parent.canvas.clientWidth * dpr;
	this.parent.canvas.height = this.parent.canvas.clientHeight * dpr;
	this.parameters.screenWidth = this.parent.canvas.width;
	this.parameters.screenHeight = this.parent.canvas.height;
	this.gl.viewport( 0, 0, this.parent.canvas.width, this.parent.canvas.height );
}

Dataviz.prototype.step = function( time ){
	// this.time += 0.01;

	if( this.textureReady ) this.render();
	// for( var i = 0 ; i < this.parent.audioData.dataArray2.length ; i++ ) this.texPlane.material.uniforms.vals.value[i] = this.parent.audioData.dataArray2[i] / 255;
	// this.texPlane.material.uniforms.time.value = this.time;
	// this.texPlane.material.uniforms.energy.value = this.parent.audioData.timer.position.x;
}

module.exports = Dataviz;