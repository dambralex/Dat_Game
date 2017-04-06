var instance = {};

var init = function(){
	// Application config
	instance.game = new Game;
	instance.mouseObj = new MouseObj;
	this.timeZero = Date.now();

	// Canvas
	instance.canvas = document.getElementById('canvas');
    instance.ctx = instance.canvas.getContext('2d');

	instance.canvas.addEventListener('mousedown', processInput, true);
	instance.canvas.addEventListener('mouseup', processInput, true);
	instance.canvas.addEventListener('mousemove', processInput, true);

	// debuging
	window.addEventListener('keydown', debug, false);

	instance.canvas.addEventListener('contextmenu', function(e) {
    	if (e.button === 2) {
    		e.preventDefault();
    		return false;
    	}
	}, false);

	// Game Config
	instance.game.init();
}

var debug = function(event){
	if(event.keyCode == 65){	// 'a'
		instance.game.spawnMechant(instance.mouseObj.mouseX, instance.mouseObj.mouseY);
		console.log("APPARAIT SHENRON");
	} 

}

var run = function(){
	var fps = 60;
	var clock = Date.now();
	var timeSinceLastUpdate = 0;
	var interval = 1000/fps;
	var delta;

	delta = clock - this.timeZero;
	this.timeZero = clock;
	timeSinceLastUpdate += delta;

	while(timeSinceLastUpdate > interval){
		timeSinceLastUpdate -= interval;

		// processInput();
		update();
	}

	draw();

	requestAnimationFrame(run);
}

// var map = new Map("premiere");
var draw = function(){
	instance.canvas.width  = window.innerWidth;
	instance.canvas.height = window.innerHeight;
	instance.ctx.clearRect(0, 0, instance.canvas.width, instance.canvas.height);

    instance.game.draw(instance.ctx);
    instance.mouseObj.draw(instance.ctx);

	// console.log("draw");

   	//game.draw();
}

var update = function(){
	instance.game.update();
	// console.log("update");
}

var processInput = function(event){

	// if(isDrawing){
	// 	isDrawing = false;
	// 	instance.ctx.beginPath();
	// 	instance.ctx.rect(startX, startY, mouseX - startX, mouseY - startY);
	// 	instance.ctx.stroke();
	// }
	// else{
	// 	isDrawing = true;
	// 	startX = mouseX;
	// 	startY = mouseY;
	// }

	switch(event.type){
		case "mousedown" : 
			instance.mouseObj.startX = event.offsetX;
			instance.mouseObj.startY = event.offsetY;
			instance.mouseObj.mouseX = event.offsetX;
			instance.mouseObj.mouseY = event.offsetY;
			if(event.which == 1){
				instance.mouseObj.isDrawing = true;
			}
			break;
		case "mouseup" : 
			if(event.which == 1){
				instance.game.handleLeftClick(instance.mouseObj.startX, 
					instance.mouseObj.startY, 
					instance.mouseObj.mouseX, 
					instance.mouseObj.mouseY);
			}
			else if(event.which == 3){
				instance.game.handleRightClick(instance.mouseObj.mouseX, 
					instance.mouseObj.mouseY);
			}

			instance.mouseObj.isDrawing = false;
			instance.mouseObj.startX = event.offsetX;
			instance.mouseObj.startY = event.offsetY;
			
			break;
		case "mousemove" :
			instance.mouseObj.mouseX = event.offsetX;
			instance.mouseObj.mouseY = event.offsetY;
			break;
	}

	// console.log(mouseDownX+", "+mouseDownY+", "+mouseUpX+", "+mouseUpY);

	// game.processInput();
}


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

window.onload = function(){

	init();

	run();

	// game.init();

	// canvas.width  = map.getLargeur() * 32;
	// canvas.height = map.getHauteur() * 32;
	
	// map.dessinerMap(ctx);
}
