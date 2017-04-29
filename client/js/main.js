var init = function(){
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	// Application config
	this.game = new Game;
	this.timeZero = Date.now();
	this.fps = 60;
	this.interval = 1000/fps;
	this.delta = 0;	
	this.now;

	// this.spriteCanvas = document.getElementById('spriteCanvas');
 //    this.spriteContext = spriteCanvas.getContext('2d');
    this.mapCanvas = document.getElementById('mapCanvas');
    this.mapContext = mapCanvas.getContext('2d');
    this.canvas = document.getElementById('hudCanvas');
    this.context = canvas.getContext('2d');

    this.mapCanvas.width = window.innerWidth;
    this.mapCanvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;

	// Game Config
	this.game.init();

	window.setInterval(this.game.tick, 1000);
}

var run = function(){

	requestAnimationFrame(run);

	this.now = Date.now();

	this.delta = this.now - this.timeZero;
	// console.log(1000/this.delta);

	// this.timeZero = clock;
	if(this.delta > this.interval){
		this.timeZero = this.now - (this.delta % this.interval);
		draw();
	}

	update();
}

var draw = function(){
	this.mapContext.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
	this.mapContext.save();
	this.mapContext.fillStyle = 'black';
	this.mapContext.fillRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
	this.mapContext.restore();

	// this.spriteContext.clearRect(0, 0, this.spriteCanvas.width, this.spriteCanvas.height);
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.game.draw(this.mapContext, this.context);
	drawStats();
}

var drawStats = function(){
	this.context.save();
	this.context.fillStyle = 'white';
    this.context.font = "10pt Arial";
    this.context.fillText("FPS : " + Math.round(1000/this.delta), 30, 30);
    this.context.restore();
}

var update = function(){
	this.game.update(this.delta/1000);
}

window.onload = function(){
	init();
	run();
}
