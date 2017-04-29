var that;

class Game{
	constructor(){
	// Usefull for listeners methodes
	that = this;

	// Setting up the HUD
	this.hud = new Hud(this);

	// Setting up the Map
	this.map = new Map(map1);

	// Setting up the Camera
	this.camera = new Camera(this, 0, 0, 1920, 1080, this.map.getWidth()*32, this.map.getHeight()*32);

	// Setting up the input system
	this.mouseObj = new MouseObj;
	// this.keyboardObj = new KeayboardObj();

	// Setting up our entities
	this.entities = {
		town : [],
		squad : [],
		unit : []
	};
	this.selectedEntities = {
		town : null,
		unit : [],
		squad : []
	}

	// Setting up the player
	this.player = new Player(this, "jev", true, 100, 200);
	}

	init(){
		this.hud.init();
	
		var mapCanvas = document.getElementById('mapCanvas');
		// var spriteCanvas = document.getElementById('spriteCanvas');
		var hudCanvas = document.getElementById('hudCanvas');

		this.camera.wView = window.innerWidth;
    	this.camera.hView = window.innerHeight;

		window.onresize = function(event) {
    		mapCanvas.width = window.innerWidth;
    		mapCanvas.height = window.innerHeight;
    		hudCanvas.width = window.innerWidth;

    		that.camera.wView = window.innerWidth;
    		that.camera.hView = window.innerHeight;
		};
	
		this.disableContextMenu();
	
		this.addEventListenerToCanvas(mapCanvas, this.processGameInput);
		this.addEventListenerToCanvas(hudCanvas, this.processHudInput);
	}

	disableContextMenu(){
		window.addEventListener('contextmenu', function(e) {
	    	if (e.button === 2) {
	    		e.preventDefault();
	    		return false;
	    	}
		}, false);
	}
	
	addEventListenerToCanvas(canvas, callback){
		canvas.addEventListener('mousedown', callback, true);
		canvas.addEventListener('mouseup', callback, true);
		canvas.addEventListener('mousemove', callback, true);
	}
	
	update(delta){
		this.camera.update(delta, this.mouseObj.outLeft, 
								  this.mouseObj.outTop, 
								  this.mouseObj.outRight,
								  this.mouseObj.outBottom);
	
		this.forEachEntity(function(entity){
			entity.update(delta);
		})
	}
	
	draw(mapContext, hudContext) {
		this.drawOnMapContext(mapContext);
		// this.drawOnSpriteContext(spriteContext);
		this.drawOnHudContext(hudContext);
	}
	
	drawOnMapContext(mapContext){
		this.map.draw(mapContext, this.camera.posX, this.camera.posY);
	
		this.forEachEntity(function(entity){
			entity.draw(mapContext, that.camera.posX, that.camera.posY);
		});
	
		// for(var t in this.entities.town)
		// 	this.entities.town[t].draw(mapContext, this.camera.posX, this.camera.posY) ;
		// for(var s in this.entities.squad)
		// 	this.entities.squad[s].draw(mapContext, that.camera.posX, that.camera.posY);
		// for(var u in this.entities.unit)
		// 	this.entities.unit[u].draw(mapContext, that.camera.posX, that.camera.posY);
	
		this.mouseObj.draw(mapContext, this.camera.posX, this.camera.posY);
	
		this.hud.draw(mapContext);
	}
	
	drawOnSpriteContext(spriteContext){
		
	}
	
	drawOnHudContext(hudContext){
		this.hud.draw(hudContext);
	
		var test = this.player.mainTown.getScreenPosition(this.camera.posX, this.camera.posY);
		hudContext.save();
		hudContext.fillStyle = 'white';
	    hudContext.font = "10pt Arial";
	    hudContext.fillText("Town : " + test.x + ", " +test.y, 30, 50);
	    hudContext.fillText("Camera : " + this.camera.posX + ", " +this.camera.posY, 30, 70);
	    if(this.selectedEntities.unit[0]){
	    	hudContext.fillText("Squad : " + this.selectedEntities.unit[0].posX + ", " +this.selectedEntities.unit[0].posY, 30, 90);
	    }
	    hudContext.restore();	
	}
	
	processInput(event){
	
	}
	
	processHudInput(event){
		switch(event.type){
			case "mousedown" : 
				if(event.which == 1){
					that.hud.handleLeftClick(event.offsetX, event.offsetY);
				}
				break;	
		}
	}
	
	processGameInput(event){
		switch(event.type){
			case "mousedown" : 
				that.mouseObj.startX = event.pageX;
				that.mouseObj.startY = event.pageY;
				that.mouseObj.mouseX = event.pageX;
				that.mouseObj.mouseY = event.pageY;
				if(event.which == 1){
					that.mouseObj.setIsDrawing(true, that.camera.posX, that.camera.posY);
				}
				break;	
			case "mouseup" : 
				if(event.which == 1){
					that.handleLeftClick(that.mouseObj.getSelectionBox(that.camera.posX, that.camera.posY));
				}
				else if(event.which == 3){
					that.handleRightClick(that.mouseObj.mouseX, 
						that.mouseObj.mouseY);
				}
	
				that.mouseObj.setIsDrawing(false);
				that.mouseObj.startX = event.offsetX;
				that.mouseObj.startY = event.offsetY;
				
				break;
			case "mousemove" :
				that.mouseObj.mouseX = event.pageX;
				that.mouseObj.mouseY = event.pageY;
				that.handleMouseMove(that.mouseObj.mouseX, 
						that.mouseObj.mouseY);
				break;
		}
	}
	
	handleLeftClick(selectionBox){
		var entityBox = {x : 0, y : 0, w : 0, h : 0};
	
		this.selectedEntities.town = null;
		this.selectedEntities.unit = [];
		// this.selectedEntities.squad = [];
	
		this.forEachTown(function(town){
			entityBox = town.getScreenPosition(that.camera.posX, that.camera.posY);
			entityBox.w = town.width;
			entityBox.h = town.height;
	
			if(collisionBox(selectionBox, entityBox)){
				that.selectedEntities.town = town;	
				town.select();	
			}
			else{
				town.unselect();
			}
		});

		this.forEachUnit(function(unit){
			entityBox = unit.getScreenPosition(that.camera.posX, that.camera.posY);
			entityBox.w = unit.width;
			entityBox.h = unit.height;

			if(collisionBox(selectionBox, entityBox)){
					unit.select();
					that.selectedEntities.unit.push(unit);
				// if(!unit.squad.selected){
				// 	unit.squad.select();
				// 	that.selectedEntities.squad.push(unit.squad);
				// }
			}
			else{
				unit.unselect();
				// unit.squad.unselect();
			}
		});

		// console.log(this.selectedEntities.unit);

	}
	
	handleRightClick(x, y){
		for(var s in this.selectedEntities.unit){
			if(this.selectedEntities.unit[s].isMovable() && this.selectedEntities.unit[s].isAllied()){
				var clickMouse = this.convertClickPosition(x, y);
				this.selectedEntities.unit[s].setDestination(clickMouse.x, clickMouse.y);
			}
		}
	}

	convertClickPosition(xClick, yClick){
		return {x : xClick*0.5 + yClick + this.camera.posX + this.camera.posY, y : xClick*-0.5 + yClick + this.camera.posY - this.camera.posX}
	}
	
	handleMouseMove(x, y){
		if(x < 100)
			this.mouseObj.setOutLeft(true);
		else
			this.mouseObj.setOutLeft(false);
	
		if(x > this.camera.wView - 100)
			this.mouseObj.setOutRight(true);
		else
			this.mouseObj.setOutRight(false);
	
		if(y < 100)
			this.mouseObj.setOutTop(true);
		else
			this.mouseObj.setOutTop(false);
	
		if(y > this.camera.yView - 100)
			this.mouseObj.setOutBottom(true);
		else
			this.mouseObj.setOutBottom(false);
	}
	
	handleCollision(){
	
	}
	
	checkCombatZone(){
	
	}
	
	// Lache un comm ;)
	spawnMechant(x, y){
		
	}
	
	forEachEntity(callback){	
		for(var t in this.entities.town)
			callback(this.entities.town[t]);
		for(var s in this.entities.squad)
			callback(this.entities.squad[s]);
		for(var u in this.entities.unit)
			callback(this.entities.unit[u]);
	}
	
	forEachTown(callback){	
		for(var t in this.entities.town)
			callback(this.entities.town[t]);
	}
	
	forEachSquad(callback){	
		for(var s in this.entities.squad)
			callback(this.entities.squad[s]);
	}
	
	forEachUnit(callback){	
		for(var u in this.entities.unit)
			callback(this.entities.unit[u]);
	}

	tick(){
		that.player.tick();
	}

}

// function Game(){
// 	// Usefull for listeners methodes
// 	that = this;

// 	// Setting up the HUD
// 	this.hud = new Hud(this);

// 	// Setting up the Map
// 	this.map = new Map(map1);

// 	// Setting up the Camera
// 	this.camera = new Camera(this, 0, 0, 1920, 1080, this.map.getWidth()*32, this.map.getHeight()*32);

// 	// Setting up the input system
// 	this.mouseObj = new MouseObj;
// 	// this.keyboardObj = new KeayboardObj();

// 	// Setting up our entities
// 	this.entities = {
// 		town : [],
// 		squad : [],
// 		unit : []
// 	};
// 	this.selectedEntities = {
// 		town : null,
// 		squad : []
// 	}

// 	// Setting up the player
// 	this.player = new Player(this, "jev", true, 100, 200);
// 	this.player = new Player(this, "jeff", true, 1000, 200);
// }

// Game.prototype.init = function(){
// 	this.hud.init();

// 	var mapCanvas = document.getElementById('mapCanvas');
// 	// var spriteCanvas = document.getElementById('spriteCanvas');
// 	var hudCanvas = document.getElementById('hudCanvas');

// 	this.disableContextMenu(mapCanvas);
// 	// this.disableContextMenu(spriteCanvas);
// 	this.disableContextMenu(hudCanvas);

// 	this.addEventListenerToCanvas(mapCanvas, this.processGameInput);
// 	this.addEventListenerToCanvas(hudCanvas, this.processHudInput);
// }

// Game.prototype.disableContextMenu = function(canvas){
// 	canvas.addEventListener('contextmenu', function(e) {
//     	if (e.button === 2) {
//     		e.preventDefault();
//     		return false;
//     	}
// 	}, false);
// }

// Game.prototype.addEventListenerToCanvas = function(canvas, callback){
// 	canvas.addEventListener('mousedown', callback, true);
// 	canvas.addEventListener('mouseup', callback, true);
// 	canvas.addEventListener('mousemove', callback, true);
// }

// Game.prototype.update = function(delta){
// 	this.camera.update(delta, this.mouseObj.outLeft, 
// 							  this.mouseObj.outTop, 
// 							  this.mouseObj.outRight,
// 							  this.mouseObj.outBottom);

// 	this.forEachEntity(function(entity){
// 		entity.update(delta);
// 	})
// }

// Game.prototype.draw = function(mapContext, hudContext) {
// 	this.drawOnMapContext(mapContext);
// 	// this.drawOnSpriteContext(spriteContext);
// 	this.drawOnHudContext(hudContext);
// }

// Game.prototype.drawOnMapContext = function(mapContext){
// 	this.map.draw(mapContext, this.camera.posX, this.camera.posY);

// 	this.forEachTown(function(town){
// 		town.draw(mapContext, that.camera.posX, that.camera.posY);
// 	});

// 	// for(var t in this.entities.town)
// 	// 	this.entities.town[t].draw(mapContext, this.camera.posX, this.camera.posY) ;
// 	for(var s in this.entities.squad)
// 		this.entities.squad[s].draw(mapContext);
// 	for(var u in this.entities.unit)
// 		this.entities.unit[u].draw(mapContext);

// 	this.mouseObj.draw(mapContext, this.camera.posX, this.camera.posY);

// 	this.hud.draw(mapContext);
// }

// Game.prototype.drawOnSpriteContext = function(spriteContext){
	
// }

// Game.prototype.drawOnHudContext = function(hudContext){
// 	this.hud.draw(hudContext);

// 	var test = this.player.mainTown.getScreenPosition(this.camera.posX, this.camera.posY);
// 	hudContext.save();
// 	hudContext.fillStyle = 'white';
//     hudContext.font = "10pt Arial";
//     hudContext.fillText("Town : " + test.x + ", " +test.y, 30, 50);
//     hudContext.fillText("Camera : " + this.camera.posX + ", " +this.camera.posY, 30, 70);
//     hudContext.restore();	
// }

// Game.prototype.processInput = function(event){

// }

// Game.prototype.processHudInput = function(event){
// 	switch(event.type){
// 		case "mousedown" : 
// 			if(event.which == 1){
// 				that.hud.handleLeftClick(event.offsetX, event.offsetY);
// 			}
// 			break;	
// 	}
// }

// Game.prototype.processGameInput = function(event){
// 	switch(event.type){
// 		case "mousedown" : 
// 			that.mouseObj.startX = event.offsetX;
// 			that.mouseObj.startY = event.offsetY;
// 			that.mouseObj.mouseX = event.offsetX;
// 			that.mouseObj.mouseY = event.offsetY;
// 			if(event.which == 1){
// 				that.mouseObj.setIsDrawing(true, that.camera.posX, that.camera.posY);
// 			}
// 			break;	
// 		case "mouseup" : 
// 			if(event.which == 1){
// 				that.handleLeftClick(that.mouseObj.getSelectionBox(that.camera.posX, that.camera.posY));
// 			}
// 			else if(event.which == 3){
// 				that.handleRightClick(that.mouseObj.mouseX, 
// 					that.mouseObj.mouseY);
// 			}

// 			that.mouseObj.setIsDrawing(false);
// 			that.mouseObj.startX = event.offsetX;
// 			that.mouseObj.startY = event.offsetY;
			
// 			break;
// 		case "mousemove" :
// 			that.mouseObj.mouseX = event.offsetX;
// 			that.mouseObj.mouseY = event.offsetY;
// 			that.handleMouseMove(that.mouseObj.mouseX, 
// 					that.mouseObj.mouseY);
// 			break;
// 	}
// }

// Game.prototype.handleLeftClick = function(selectionBox){
// 	var entityBox = {x : 0, y : 0, w : 0, h : 0};

// 	this.selectedEntities.town = null;
// 	this.selectedEntities.squad = [];

// 	this.forEachTown(function(town){
// 		entityBox = town.getScreenPosition(that.camera.posX, that.camera.posY);
// 		entityBox.w = town.width;
// 		entityBox.h = town.height;

// 		if(collisionBox(selectionBox, entityBox)){
// 			that.selectedEntities.town = town;	
// 			town.select();	
// 		}
// 		else{
// 			town.unselect();
// 		}
// 	});
// }

// Game.prototype.handleRightClick = function(x, y){

// }

// Game.prototype.handleMouseMove = function(x, y){
// 	if(x < 100)
// 		this.mouseObj.setOutLeft(true);
// 	else
// 		this.mouseObj.setOutLeft(false);

// 	if(x > this.camera.wView - 100)
// 		this.mouseObj.setOutRight(true);
// 	else
// 		this.mouseObj.setOutRight(false);

// 	if(y < 100)
// 		this.mouseObj.setOutTop(true);
// 	else
// 		this.mouseObj.setOutTop(false);

// 	if(y > this.camera.yView - 100)
// 		this.mouseObj.setOutBottom(true);
// 	else
// 		this.mouseObj.setOutBottom(false);
// }

// Game.prototype.handleCollision = function(){

// }

// Game.prototype.checkCombatZone = function(){

// }

// // Lache un comm ;)
// Game.prototype.spawnMechant = function(x, y){
	
// }

// Game.prototype.forEachEntity = function(callback){	
// 	for(var t in this.entities.town)
// 		callback(this.entities.town[t]);
// 	for(var s in this.entities.squad)
// 		callback(this.entities.squad[s]);
// 	for(var u in this.entities.unit)
// 		callback(this.entities.unit[u]);
// }

// Game.prototype.forEachTown = function(callback){	
// 	for(var t in this.entities.town)
// 		callback(this.entities.town[t]);
// }

// Game.prototype.forEachSquad = function(callback){	
// 	for(var s in this.entities.squad)
// 		callback(this.entities.squad[s]);
// }

// Game.prototype.forEachUnit = function(callback){	
// 	for(var u in this.entities.unit)
// 		callback(this.entities.unit[u]);
// }

