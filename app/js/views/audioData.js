var Matter = require('matter-js');

var AudioData = function( parent ) {
	this.parent = parent;
	this.size = 512;

	this.audio = new Audio();
	this.audio.src = 'media/t2.mp3';
	this.audio.controls = true;
	this.audio.autoplay = false;
	this.playing = false;
	this.positions = [];

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

	this.bodies = [];
	this.constrains = [];
	for( var i = 0 ; i < this.size ; i++ ){
		var body = Matter.Bodies.circle( i, 128, 1, { collisionFilter : 0, mass : 10 } );
		var constrain = Matter.Constraint.create({ pointA : { x : i, y : 128 }, bodyB : body, length : 0, stiffness : 0.2 });
		this.bodies.push( body );
		Matter.World.add( engine.world, [ body, constrain ] );
		if( i > 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ bodyA : this.bodies[i-1], bodyB : body, length : 1, stiffness : 0.5 }) );
	}

	this.timer = Matter.Bodies.circle( 0, 200, 10, { collisionFilter : 0, mass : 1, frictionAir : 1 } );
	Matter.World.add( engine.world, this.timer );

	Matter.Engine.run(engine);
}

AudioData.prototype.makeAnalyser = function( time ) {
	var audioCtx = new ( window.AudioContext || window.webkitAudioContext )();
	this.analyser = audioCtx.createAnalyser();

	this.analyser2 = audioCtx.createAnalyser();
	this.analyser2.fftSize = this.size * 2;
	this.dataArray2 = new Uint8Array(this.size);

	this.analyser.fftSize = this.size * 2;
	this.dataArray = new Uint8Array(this.size);

	var source = audioCtx.createMediaElementSource(this.audio);

	var biquadFilter = audioCtx.createBiquadFilter();
	// 'lowpass','highpass','bandpass','lowshelf'
	biquadFilter.type = 'lowpass';
	biquadFilter.frequency.value = 100;
	console.log(biquadFilter)
	source.connect(biquadFilter);

	biquadFilter.connect(this.analyser);
	biquadFilter.connect(this.analyser2);
	
	source.connect(audioCtx.destination);
};

AudioData.prototype.playPause = function( time ) {
	this.playing = !this.playing;
	if( this.playing ) this.audio.play();
	else this.audio.pause();
};

AudioData.prototype.updateTexture = function( ) {
	var vals = new Uint8Array(this.size * 3);
	var f = 0;
	for( var i = 0 ; i < this.bodies.length ; i++ ){
		if( this.playing )  Matter.Body.setPosition(  this.bodies[i], { x : i, y : this.dataArray[i] } );
		this.bodies[i].position.x = i;
		this.positions[i] = this.bodies[i].position.y - 128;
		vals[ i * 3 ] = this.bodies[i].position.y;
		vals[ i * 3 + 1 ] = this.dataArray2[i];
		if( this.dataArray2[i] > 160 ) f += this.dataArray2[i] / 255 / 256 / 20;
		
		vals[ i * 3 + 2 ] = this.bodies[i].position.y;
	}
	this.data.set(vals);
	this.audioTexture.needsUpdate = true;
	
	Matter.Body.applyForce( this.timer, this.timer.position, { x : f , y : 0 } );
};

AudioData.prototype.step = function( time ) {
	this.analyser.getByteTimeDomainData(this.dataArray);
	this.analyser2.getByteFrequencyData(this.dataArray2);
	this.updateTexture();	
};

module.exports = AudioData;