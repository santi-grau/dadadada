var logoSVG = require('./../../media/logo.svg');

var Texture = function( parent, size ){
	this.parent = parent;
	var logoMargin = this.parent.parent.logoMargin;
 	var logo = new DOMParser().parseFromString(logoSVG, "image/svg+xml");
 	var viewBox = logo.getElementsByTagName('svg')[0].getAttribute('viewBox').split(' ');
 	var canvas = document.createElement('canvas');
 	var logoAR = viewBox[3] / viewBox[2];
	canvas.width  = size;
	canvas.height = size;
	var ctx = canvas.getContext('2d');

	var w = ctx.canvas.width - ( canvas.width * logoMargin ) * 2;
	var h = w * logoAR;
	window._DADADADA.logoRatio = h / size;

 	var img = new Image();
 	var _this = this;
 	img.onload = function () {
		ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
		var w = ctx.canvas.width - ( canvas.width * logoMargin ) * 2;
		var h = w * logoAR;
		ctx.drawImage(this, canvas.width * logoMargin, canvas.height / 2 - h / 2, w, h );  
		window._DADADADA.texture = ctx.canvas.toDataURL();
		_this.parent.makeTexture();
    };
    img.src = 'data:image/svg+xml,' + '<svg xmlns="http://www.w3.org/2000/svg" width = "'+viewBox[2]+'" height = "'+viewBox[3]+'" >' + logoSVG + '</svg>';
}

module.exports = Texture;