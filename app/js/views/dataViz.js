var vertexShader = require('./../../shaders/vertex.glsl');
var fragmentShader = require('./../../shaders/fragment.glsl');

var Dataviz = function( parent ){
	this.parent = parent;

	this.time = 0;

	var geometry = new THREE.PlaneBufferGeometry( 800, 800 );

	var texture = new THREE.TextureLoader().load( "media/logo.png" );

	var material = new THREE.ShaderMaterial( {
		uniforms: {
			logo : { value : texture },
			waveForm : { value : this.parent.audioData.audioTexture },
			time : { value: 1.0 },
			energy : { value: 0 },
			resolution : { value: new THREE.Vector2( this.parent.containerEl.offsetWidth, this.parent.containerEl.offsetHeight  ) }
		},
		transparent : true,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader

	} );

	this.texPlane = new THREE.Mesh( geometry, material );
	this.parent.scene.add( this.texPlane );
}

Dataviz.prototype.step = function( time ){
	this.time += 0.01;
	this.texPlane.material.uniforms.time.value = this.time;
	this.texPlane.material.uniforms.energy.value = this.parent.audioData.timer.position.x;
}

module.exports = Dataviz;