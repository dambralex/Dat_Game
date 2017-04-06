// define(['map', 'squad', 'unit','../../shared/js/gametypes'], function(Map, Squad, Unit)){
// 	var Game = {
// 		init: function(){
// 			this.started = false;
// 			this.hasNeverStarted = true;

// 			this.player = new Squad("squad", "");

// 			this.entities = {};
// 		}

// 		tick: function(){
// 			this.currentTime = new Date().getTime();
// 		}
// 	};


function Game(){
	this.started = false;
	this.hasNeverStarted = true;

	this.entities = [];
	this.selectedEntities = [];

	this.player = new Squad(this, true);
}

Game.prototype.init = function(){
	// this.entities.push(this.player);

	this.hasNeverStarted = false;
	this.started = true;
}

Game.prototype.update = function(){
	for(var e in this.entities)
		this.entities[e].update();

	this.handleCollision();
}

Game.prototype.draw = function(context) {
	for(var e in this.entities)
		this.entities[e].draw(context);
};

Game.prototype.handleLeftClick = function(x, y, w, h){
	var mouseBox = {x : x, y : y, w : w - x, h : h - y};
	var entityBox = {x : 0, y : 0, w : 0, h : 0};

	this.selectedEntities = [];

	for(var e in this.entities){
		entityBox.x = this.entities[e].posX;
		entityBox.y = this.entities[e].posY;
		entityBox.w = this.entities[e].width;
		entityBox.h = this.entities[e].height;

		if(collisionBox(mouseBox, entityBox)){
			this.entities[e].select();
			if(this.entities[e].squad)
				this.selectedEntities.push(this.entities[e].squad);
			else
				this.selectedEntities.push(this.entities[e]);
		}
		else{
			this.entities[e].unselect();
		}
	}
}

Game.prototype.handleRightClick = function(x, y){
	for(var e in this.selectedEntities){
		if(this.selectedEntities[e].isMovable() && this.selectedEntities[e].isAllied()){
			this.selectedEntities[e].setDestination(x, y);
		}
	}
}

Game.prototype.handleCollision = function(){
	this.checkCombatZone();
}

Game.prototype.checkCombatZone = function(){
	for(var e1 in this.entities)
		for(var e2 in this.entities){
			if(e1 != e2)
				if(!this.entities[e1].isAlliedWith(this.entities[e2])){
					if(collisionBoxes(this.entities[e1].getCombatZone(), this.entities[e2].getCombatZone())){
						if(!this.entities[e1].attacking && !this.entities[e2].dead)
							this.entities[e1].engage(this.entities[e2]);
						if(!this.entities[e2].attacking && !this.entities[e1].dead)
							this.entities[e2].engage(this.entities[e1]);
					}
				}	
		}
}

// Lache un comm ;)
Game.prototype.spawnMechant = function(x, y){
	var mechant = new Squad(this, false);
	mechant.posX = x;
	mechant.posY = y;
}