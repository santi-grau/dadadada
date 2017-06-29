var Debugger = function( parent ){
	this.parent = parent;
	this.addWaveform();
}

Debugger.prototype.addWaveform = function(){
	this.waveForm = new THREE.Object3D();

	var geometry = new THREE.PlaneBufferGeometry( this.parent.audioData.size, 100 );
	var material = new THREE.MeshBasicMaterial( { map : this.parent.audioData.audioTexture } );
	this.texPlane = new THREE.Mesh( geometry, material );
	this.waveForm.add( this.texPlane );

	this.wave = new THREE.Object3D();
	this.waveForm.add( this.wave );
	for( var i = 0 ; i < this.parent.audioData.size ; i++ ){
		var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.set(  i - this.parent.audioData.size / 2, 0, 1 );
		this.wave.add( cube );
	}

	this.wave2 = new THREE.Object3D();
	this.waveForm.add( this.wave2 );
	for( var i = 0 ; i < this.parent.audioData.dataArray2.length ; i++ ){
		var width = this.parent.audioData.size / this.parent.audioData.dataArray2.length;
		var geometry = new THREE.BoxBufferGeometry( width, 1, 1 );
		var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.set(  width * i - this.parent.audioData.size / 2 + width / 2, 0, 1 );
		this.wave2.add( cube );
	}


	this.waveForm.position.set( -this.parent.containerEl.offsetWidth / 2 + this.parent.audioData.size / 2 , this.parent.containerEl.offsetHeight / 2 - 50, 0 );

	this.parent.scene.add( this.waveForm );
}

Debugger.prototype.step = function( time ){
	for( var i = 0 ; i < this.wave.children.length ; i++ ) this.wave.children[i].position.y = this.parent.audioData.positions[i] / 128 * 50
	for( var i = 0 ; i < this.wave2.children.length ; i++ ) this.wave2.children[i].position.y = this.parent.audioData.dataArray2[i] / 128 * 50 - 50
}

module.exports = Debugger;