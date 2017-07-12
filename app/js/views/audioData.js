// var Matter = require('matter-js');
// var SimplexNoise = require('simplex-noise');

var AudioData = function( parent ) {
	this.parent = parent;
	this.size = 16;

	this.time = 0;
	this.timeInc = 0.001;

	if( !window._DADADADA.topVal ){
		window._DADADADA.topVal = [];
		for( var i = 0 ; i < this.size ; i++ ) window._DADADADA.topVal[i] = 0;
	}
	if( !window._DADADADA.botVal ){
		window._DADADADA.botVal = [];
		for( var i = 0 ; i < this.size ; i++ ) window._DADADADA.botVal[i] = 0;
	}

	if( !window._DADADADA.audio ){
		window._DADADADA.audio = new Audio();
		window._DADADADA.audio.controls = true;
		window._DADADADA.audio.autoplay = false;
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

AudioData.prototype.step = function( time ) {
	if(!this.playing) return;
	// console.log(window._DADADADA.topVal)
	this.time += this.timeInc;
	window._DADADADA.domain.getByteTimeDomainData( window._DADADADA.domainArray );
	window._DADADADA.frequency.getByteFrequencyData( window._DADADADA.frequencyArray );
};

module.exports = AudioData;