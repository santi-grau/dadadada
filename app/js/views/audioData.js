// var THREE = require('three');
var Matter = require('matter-js');
var SimplexNoise = require('simplex-noise');

var AudioData = function( parent ) {
	this.parent = parent;
	this.size = 32;

	this.time = 0;
	this.timeInc = 0.001;

	this.audio = new Audio();
	this.audio.src = 'media/t2.mp3';
	this.audio.controls = true;
	this.audio.autoplay = false;
	this.playing = false;
	this.positions = [];

	this.space = 10;

	this.simplex = new SimplexNoise(Math.random);

	this.data = new Uint8Array(this.size * 3);
	this.audioTexture = new THREE.DataTexture( this.data, this.size, 1, THREE.RGBFormat );
	this.audioTexture.needsUpdate = true;

	this.makeAnalyser();

	var engine = Matter.Engine.create();

	// create a renderer
	// var render = Matter.Render.create({
	// 	element: document.body,
	// 	engine: engine
	// });
	// Matter.Render.run(render);

	engine.world.gravity.y = 0;

	this.top = [];
	this.bot = [];

	for( var i = 0 ; i < this.size ; i ++ ){
		var body = Matter.Bodies.circle( i * 10, 200, 2, { collisionFilter : 0, mass :  1 } );
		var constrain = Matter.Constraint.create({ pointA : { x : i * 10, y : 200 }, bodyB : body, stiffness : 0.1 });

		this.top.push( body );

		Matter.World.add( engine.world, [ body, constrain ] );
		if( i == 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : - 10, y : 200 }, bodyB : body, length : 0, stiffness : .1 }) );
		if( i > 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ bodyA : this.top[i-1], bodyB : body, length : 0, stiffness : .1 }) );
		if( i == this.size - 1 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : (i + 1) * 10, y : 200 }, bodyB : body, length : 0, stiffness : .1 }) );

		var body = Matter.Bodies.circle( i * 10, 200, 2, { collisionFilter : 0, mass :  1 } );
		var constrain = Matter.Constraint.create({ pointA : { x : i * 10, y : 200 }, bodyB : body, stiffness : .1 });

		this.bot.push( body );

		Matter.World.add( engine.world, [ body, constrain ] );
		if( i == 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : - 10, y : 200 }, bodyB : body, length : 0, stiffness : .1 }) );
		if( i > 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ bodyA : this.bot[i-1], bodyB : body, length : 0, stiffness : .1 }) );
		if( i == this.size - 1 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : (i + 1) * 10, y : 200 }, bodyB : body, length : 0, stiffness : .1 }) );
	}

	Matter.Engine.run(engine);
}

AudioData.prototype.makeAnalyser = function( time ) {
	var audioCtx = new ( window.AudioContext || window.webkitAudioContext )();
	this.domain = audioCtx.createAnalyser();
	this.domain.fftSize = this.size * 2;
	this.domainArray = new Uint8Array(this.size);

	this.frequency = audioCtx.createAnalyser();
	this.frequency.fftSize = this.size * 2;
	this.frequencyArray = new Uint8Array(this.size);

	var source = audioCtx.createMediaElementSource(this.audio);
	source.connect(this.domain);
	source.connect(this.frequency);
	
	source.connect(audioCtx.destination);

	audioCtx.close();
};

AudioData.prototype.playPause = function( time ) {
	this.playing = !this.playing;
	if( this.playing ) this.audio.play();
	else this.audio.pause();
};

AudioData.prototype.updateTexture = function( ) {
	

	var v1 = Math.round( ( this.simplex.noise2D( this.time, 0.1 ) + 1 ) / 2 * this.size );
	var val1 = Math.round( this.frequencyArray[ v1 ] / 255 * this.size );

	for( var i = 0 ; i < val1 ; i ++ ) if( this.playing )  Matter.Body.setPosition(  this.top[i], { x : i * 10, y : 200 - ( ( this.frequencyArray[val1-i-1]) / 255 * 50 ) } );
	for( var i = val1 ; i < this.size ; i ++ ) if( this.playing )  Matter.Body.setPosition(  this.top[i], { x : i * 10, y : 200 - ( ( this.frequencyArray[i-val1]) / 255 * 50 ) } );
	for( var i = 0 ; i < val1 ; i ++ ) this.top[i].position.x = i * 10;

	var v2 = Math.round( ( this.simplex.noise2D( this.time, 0.9 ) + 1 ) / 2 * this.size );
	var val2 = Math.round( this.frequencyArray[ v2 ] / 255 * this.size );

	for( var i = 0 ; i < val2 ; i ++ ) if( this.playing )  Matter.Body.setPosition(  this.bot[i], { x : i * 10, y : 200 + ( ( this.frequencyArray[val2-i-1]) / 255 * 50 ) } );
	for( var i = val2 ; i < this.size ; i ++ ) if( this.playing )  Matter.Body.setPosition(  this.bot[i], { x : i * 10, y : 200 + ( ( this.frequencyArray[i-val2]) / 255 * 50 ) } );
	for( var i = 0 ; i < val2 ; i ++ ) this.bot[i].position.x = i * 10;

	var vals = new Uint8Array(this.size * 3);
	
	for( var i = 0 ; i < this.size ; i++ ){
		vals[ i * 3 ] =  ( 200 - this.top[i].position.y  ) / 50 * 255 ;
		vals[ i * 3 + 1 ] = ( this.bot[i].position.y - 200  ) / 50 * 255 ;
		vals[ i * 3 + 2 ] = 0;
	}

	this.data.set(vals);
	this.audioTexture.needsUpdate = true;
	
};

AudioData.prototype.step = function( time ) {
	this.time += this.timeInc;
	this.domain.getByteTimeDomainData(this.domainArray);
	this.frequency.getByteFrequencyData(this.frequencyArray);
	this.updateTexture();
};

module.exports = AudioData;