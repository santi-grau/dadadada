var Matter = require('matter-js');
var SimplexNoise = require('simplex-noise');

var Physics = function( parent ){
	this.parent = parent;
	this.simplex = new SimplexNoise(Math.random);

	var engine = Matter.Engine.create();

	// create a renderer
	// var render = Matter.Render.create({
	// 	element: this.parent.element,
	// 	engine: engine,
	// 	options : {
	// 		width : this.parent.element.offsetWidth,
	// 		height : this.parent.element.offsetHeight
	// 	}
	// });
	
	// render.canvas.style.position = 'absolute';
	// render.canvas.style.top = '0px';
	// render.canvas.style.left = '0px';
	// render.canvas.style['z-index'] = '10';
	
	// Matter.Render.run(render);
	// render.canvas.style.background = 'rgba(0,0,0,0)';

	engine.world.gravity.y = 0;

	this.initiated = false;
	this.top = [];
	this.bot = [];

	this.logoMargin = this.parent.logoMargin;
	this.w = this.parent.element.offsetWidth;
	this.h = this.parent.element.offsetHeight;

	for( var i = 0 ; i < this.parent.audioData.size ; i ++ ){
		var posX = this.logoMargin * this.w + ( this.w - (  this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1);
		var posYtop = this.h/2 + this.w * window._DADADADA.logoRatio / 2;
		var posYbot = this.h/2 - this.w * window._DADADADA.logoRatio / 2;
		var stiffnessV = 0.5;
		var stiffnessH = 0.5;

		var body = Matter.Bodies.circle( posX, this.h/2 - this.w * window._DADADADA.logoRatio / 2, 2, { collisionFilter : 0, mass :  1 } );
		var constrain = Matter.Constraint.create({ pointA : { x : posX, y : this.h/2 - this.w * window._DADADADA.logoRatio / 2 }, bodyB : body, stiffness : stiffnessV });

		this.top.push( body );

		Matter.World.add( engine.world, [ body, constrain ] );
		// if( i == 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : 0, y : posYbot }, bodyB : body, length : 0, stiffness : stiffnessV }) );
		if( i > 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ bodyA : this.top[i-1], bodyB : body, length : 0, stiffness : stiffnessV }) );
		// if( i == this.parent.audioData.size - 1 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : this.w, y : posYbot }, bodyB : body, length : 0, stiffness : stiffnessV }) );

		var body = Matter.Bodies.circle( posX, posYtop, 2, { collisionFilter : 0, mass :  1 } );
		var constrain = Matter.Constraint.create({ pointA : { x : posX, y : posYtop }, bodyB : body, stiffness : stiffnessV });

		this.bot.push( body );

		Matter.World.add( engine.world, [ body, constrain ] );
		// if( i == 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : 0, y : posYtop }, bodyB : body, length : 0, stiffness : stiffnessH }) );
		if( i > 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ bodyA : this.bot[i-1], bodyB : body, length : 0, stiffness : stiffnessH }) );
		// if( i == this.parent.audioData.size - 1 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : this.w, y : posYtop }, bodyB : body, length : 0, stiffness : stiffnessH }) );
	}

	Matter.Engine.run(engine);
}

Physics.prototype.step = function( time ){
	var dist = this.h/2 - ( this.w * window._DADADADA.logoRatio / 2 ) - Math.min( 10, this.w * this.logoMargin );

	var v1 = Math.round( ( this.simplex.noise2D( this.parent.audioData.time, 0.1 ) + 1 ) / 2 * this.parent.audioData.size );
	var val1 = Math.round( window._DADADADA.frequencyArray[ v1 ] / 255 * this.parent.audioData.size );

	for( var i = 0 ; i < val1 ; i ++ ) if( this.parent.audioData.playing ) {
		var t = ( this.simplex.noise2D( i / ( this.parent.audioData.size - 1 ) + this.parent.audioData.time, 0.25 ) + 1 ) / 2;
		Matter.Body.setPosition(  this.top[i], { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1), y : this.h/2 - this.w * window._DADADADA.logoRatio / 2 - ( ( window._DADADADA.frequencyArray[val1-i-1]) / 255 * dist * t ) } );
		window._DADADADA.topVal[i] = window._DADADADA.frequencyArray[val1-i-1] / 255 * t;
	}
	for( var i = val1 ; i < this.parent.audioData.size ; i ++ ) if( this.parent.audioData.playing ) {
		var t = ( this.simplex.noise2D( i / ( this.parent.audioData.size - 1 ) + this.parent.audioData.time, 0.25 ) + 1 ) / 2;
		Matter.Body.setPosition(  this.top[i], { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1), y : this.h/2 - this.w * window._DADADADA.logoRatio / 2 - ( ( window._DADADADA.frequencyArray[i-val1]) / 255 * dist * t ) } );
		window._DADADADA.topVal[i] = window._DADADADA.frequencyArray[i-val1] / 255 * t;
	}
	for( var i = 0 ; i < val1 ; i ++ ) this.top[i].position.x = this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1);

	var v2 = Math.round( ( this.simplex.noise2D( this.parent.audioData.time, 0.9 ) + 1 ) / 2 * this.parent.audioData.size );
	var val2 = Math.round( window._DADADADA.frequencyArray[ v2 ] / 255 * this.parent.audioData.size );

	for( var i = 0 ; i < val2 ; i ++ ) if( this.parent.audioData.playing ) {
		var t = ( this.simplex.noise2D( i / ( this.parent.audioData.size - 1 ) + this.parent.audioData.time, 0.75 ) + 1 ) / 2;
		Matter.Body.setPosition(  this.bot[i], { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1), y : this.h/2 + this.w * window._DADADADA.logoRatio / 2 + ( ( window._DADADADA.frequencyArray[val2-i-1]) / 255 * dist * t ) } );
		window._DADADADA.botVal[i] = window._DADADADA.frequencyArray[val2-i-1] / 255 * t;
	}
	for( var i = val2 ; i < this.parent.audioData.size ; i ++ ) if( this.parent.audioData.playing ) {
		var t = ( this.simplex.noise2D( i / ( this.parent.audioData.size - 1 ) + this.parent.audioData.time, 0.75 ) + 1 ) / 2;
		Matter.Body.setPosition(  this.bot[i], { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1), y : this.h/2 + this.w * window._DADADADA.logoRatio / 2 + ( ( window._DADADADA.frequencyArray[i-val2]) / 255 * dist * t ) } );
		window._DADADADA.botVal[i] = window._DADADADA.frequencyArray[i-val2] / 255 * t;
		// window._DADADADA.botVal[i] = (this.bot[i].position.y - ( this.h/2 + this.w * window._DADADADA.logoRatio / 2 ))/dist;
	}
	for( var i = 0 ; i < val2 ; i ++ ) this.bot[i].position.x = this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1);
}

module.exports = Physics;