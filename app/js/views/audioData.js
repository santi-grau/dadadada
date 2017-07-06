var Matter = require('matter-js');
var SimplexNoise = require('simplex-noise');

var AudioData = function( parent ) {
	this.parent = parent;
	this.size = 32;

	this.time = 0;
	this.timeInc = 0.001;

	if( !window._DADADADA.audio ){
		window._DADADADA.audio = new Audio();
		window._DADADADA.audio.controls = true;
		window._DADADADA.audio.autoplay = false;
		window._DADADADA.audio.setAttribute('type','audio/mpeg');
	}
	if( !window._DADADADA.audioCtx ) window._DADADADA.audioCtx = new ( window.AudioContext || window.webkitAudioContext )();
	if( !window._DADADADA.domain ){
		window._DADADADA.domain = window._DADADADA.audioCtx.createAnalyser();
		window._DADADADA.domain.fftSize = this.size * 2;
	}
	if( !window._DADADADA.domainArray ) window._DADADADA.domainArray = new Uint8Array(this.size);
	if( !window._DADADADA.frequency ){
		window._DADADADA.frequency = window._DADADADA.audioCtx.createAnalyser();
		window._DADADADA.frequency.fftSize = this.size * 2;
	}
	if( !window._DADADADA.frequencyArray ) window._DADADADA.frequencyArray = new Uint8Array(this.size);
	if( !window._DADADADA.source ){
		window._DADADADA.source = window._DADADADA.audioCtx.createMediaElementSource(window._DADADADA.audio);
		window._DADADADA.source.connect( window._DADADADA.domain );
		window._DADADADA.source.connect( window._DADADADA.frequency );
		window._DADADADA.source.connect( window._DADADADA.audioCtx.destination );
	}

	this.playing = false;

	this.simplex = new SimplexNoise(Math.random);

	var engine = Matter.Engine.create();

	// create a renderer
	var render = Matter.Render.create({
		element: this.parent.element,
		engine: engine,
		options : {
			width : this.parent.element.offsetWidth,
			height : this.parent.element.offsetHeight

		}
	});
	
	render.canvas.style.position = 'absolute';
	render.canvas.style.top = '0px';
	render.canvas.style.left = '0px';
	render.canvas.style['z-index'] = '10';
	
	Matter.Render.run(render);
	render.canvas.style.background = 'rgba(0,0,0,0)';

	engine.world.gravity.y = 0;

	this.top = [];
	this.bot = [];

	this.logoMargin = this.parent.logoMargin
	this.w = this.parent.element.offsetWidth;
	this.h = this.parent.element.offsetHeight;


	for( var i = 0 ; i < this.size ; i ++ ){

		var body = Matter.Bodies.circle( this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.size - 1), this.h/2, 2, { collisionFilter : 0, mass :  1 } );
		var constrain = Matter.Constraint.create({ pointA : { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.size - 1), y : this.h/2 }, bodyB : body, stiffness : 0.1 });

		this.top.push( body );

		Matter.World.add( engine.world, [ body, constrain ] );
		if( i == 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : - 10, y : this.h/2 }, bodyB : body, length : 0, stiffness : .1 }) );
		if( i > 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ bodyA : this.top[i-1], bodyB : body, length : 0, stiffness : .1 }) );
		if( i == this.size - 1 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : this.w, y : this.h/2 }, bodyB : body, length : 0, stiffness : .1 }) );

		var body = Matter.Bodies.circle( this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.size - 1), this.h/2, 2, { collisionFilter : 0, mass :  1 } );
		var constrain = Matter.Constraint.create({ pointA : { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.size - 1), y : this.h/2 }, bodyB : body, stiffness : .1 });

		this.bot.push( body );

		Matter.World.add( engine.world, [ body, constrain ] );
		if( i == 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : - 10, y : this.h/2 }, bodyB : body, length : 0, stiffness : .1 }) );
		if( i > 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ bodyA : this.bot[i-1], bodyB : body, length : 0, stiffness : .1 }) );
		if( i == this.size - 1 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : this.w, y : this.h/2 }, bodyB : body, length : 0, stiffness : .1 }) );
	}

	Matter.Engine.run(engine);
}

AudioData.prototype.playPause = function( ) {
	var id = ( Math.floor(Math.random() * 2) + 1 );
	window._DADADADA.audio.src = 'media/t'+ id +'.mp3';
	this.playing = !this.playing;
	if( this.playing ){
		if( window._DADADADA.current && window._DADADADA.current !== this.parent && window._DADADADA.current.audioData.playing ){
			window._DADADADA.current.audioData.playing = false;
			window._DADADADA.audio.pause();
		}
		window._DADADADA.current = this.parent;
		window._DADADADA.audio.play();
	} else {
		window._DADADADA.audio.pause();
	}
};

AudioData.prototype.updateTexture = function( ) {
	var v1 = Math.round( ( this.simplex.noise2D( this.time, 0.1 ) + 1 ) / 2 * this.size );
	var val1 = Math.round( window._DADADADA.frequencyArray[ v1 ] / 255 * this.size );

	for( var i = 0 ; i < val1 ; i ++ ) if( this.playing )  Matter.Body.setPosition(  this.top[i], { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.size - 1), y : this.h/2 - ( ( window._DADADADA.frequencyArray[val1-i-1]) / 255 * 50 ) } );
	for( var i = val1 ; i < this.size ; i ++ ) if( this.playing )  Matter.Body.setPosition(  this.top[i], { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.size - 1), y : this.h/2 - ( ( window._DADADADA.frequencyArray[i-val1]) / 255 * 50 ) } );
	for( var i = 0 ; i < val1 ; i ++ ) this.top[i].position.x = this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.size - 1);

	var v2 = Math.round( ( this.simplex.noise2D( this.time, 0.9 ) + 1 ) / 2 * this.size );
	var val2 = Math.round( window._DADADADA.frequencyArray[ v2 ] / 255 * this.size );

	for( var i = 0 ; i < val2 ; i ++ ) if( this.playing )  Matter.Body.setPosition(  this.bot[i], { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.size - 1), y : this.h/2 + ( ( window._DADADADA.frequencyArray[val2-i-1]) / 255 * 50 ) } );
	for( var i = val2 ; i < this.size ; i ++ ) if( this.playing )  Matter.Body.setPosition(  this.bot[i], { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.size - 1), y : this.h/2 + ( ( window._DADADADA.frequencyArray[i-val2]) / 255 * 50 ) } );
	for( var i = 0 ; i < val2 ; i ++ ) this.bot[i].position.x = this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.size - 1);
};

AudioData.prototype.step = function( time ) {
	if(!this.playing) return;
	this.time += this.timeInc;
	window._DADADADA.domain.getByteTimeDomainData( window._DADADADA.domainArray );
	window._DADADADA.frequency.getByteFrequencyData( window._DADADADA.frequencyArray );
	this.updateTexture();
};

module.exports = AudioData;