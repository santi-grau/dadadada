var Matter = require('matter-js');
var SimplexNoise = require('simplex-noise');

var Physics = function( parent ){
	this.parent = parent;
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

	this.logoMargin = this.parent.logoMargin;
	this.w = this.parent.element.offsetWidth;
	this.h = this.parent.element.offsetHeight;

	for( var i = 0 ; i < this.parent.audioData.size ; i ++ ){

		var body = Matter.Bodies.circle( this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1), this.h/2, 2, { collisionFilter : 0, mass :  1 } );
		var constrain = Matter.Constraint.create({ pointA : { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1), y : this.h/2 }, bodyB : body, stiffness : 0.1 });

		this.top.push( body );

		Matter.World.add( engine.world, [ body, constrain ] );
		if( i == 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : - 10, y : this.h/2 }, bodyB : body, length : 0, stiffness : .1 }) );
		if( i > 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ bodyA : this.top[i-1], bodyB : body, length : 0, stiffness : .1 }) );
		if( i == this.parent.audioData.size - 1 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : this.w, y : this.h/2 }, bodyB : body, length : 0, stiffness : .1 }) );

		var body = Matter.Bodies.circle( this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1), this.h/2, 2, { collisionFilter : 0, mass :  1 } );
		var constrain = Matter.Constraint.create({ pointA : { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1), y : this.h/2 }, bodyB : body, stiffness : .1 });

		this.bot.push( body );

		Matter.World.add( engine.world, [ body, constrain ] );
		if( i == 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : - 10, y : this.h/2 }, bodyB : body, length : 0, stiffness : .1 }) );
		if( i > 0 ) Matter.World.add( engine.world, Matter.Constraint.create({ bodyA : this.bot[i-1], bodyB : body, length : 0, stiffness : .1 }) );
		if( i == this.parent.audioData.size - 1 ) Matter.World.add( engine.world, Matter.Constraint.create({ pointA : { x : this.w, y : this.h/2 }, bodyB : body, length : 0, stiffness : .1 }) );
	}

	Matter.Engine.run(engine);
}

Physics.prototype.step = function( time ){
	var v1 = Math.round( ( this.simplex.noise2D( this.time, 0.1 ) + 1 ) / 2 * this.parent.audioData.size );
	var val1 = Math.round( window._DADADADA.frequencyArray[ v1 ] / 255 * this.parent.audioData.size );

	for( var i = 0 ; i < val1 ; i ++ ) if( this.parent.audioData.playing )  Matter.Body.setPosition(  this.top[i], { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1), y : this.h/2 - ( ( window._DADADADA.frequencyArray[val1-i-1]) / 255 * 50 ) } );
	for( var i = val1 ; i < this.parent.audioData.size ; i ++ ) if( this.parent.audioData.playing )  Matter.Body.setPosition(  this.top[i], { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1), y : this.h/2 - ( ( window._DADADADA.frequencyArray[i-val1]) / 255 * 50 ) } );
	for( var i = 0 ; i < val1 ; i ++ ) this.top[i].position.x = this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1);

	var v2 = Math.round( ( this.simplex.noise2D( this.time, 0.9 ) + 1 ) / 2 * this.parent.audioData.size );
	var val2 = Math.round( window._DADADADA.frequencyArray[ v2 ] / 255 * this.parent.audioData.size );

	for( var i = 0 ; i < val2 ; i ++ ) if( this.parent.audioData.playing )  Matter.Body.setPosition(  this.bot[i], { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1), y : this.h/2 + ( ( window._DADADADA.frequencyArray[val2-i-1]) / 255 * 50 ) } );
	for( var i = val2 ; i < this.parent.audioData.size ; i ++ ) if( this.parent.audioData.playing )  Matter.Body.setPosition(  this.bot[i], { x : this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1), y : this.h/2 + ( ( window._DADADADA.frequencyArray[i-val2]) / 255 * 50 ) } );
	for( var i = 0 ; i < val2 ; i ++ ) this.bot[i].position.x = this.logoMargin * this.w + ( this.w - ( this.logoMargin * 2 * this.w ) ) * i / (this.parent.audioData.size - 1);
}


module.exports = Physics;