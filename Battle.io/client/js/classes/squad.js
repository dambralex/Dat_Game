// define(['entity', 'timer'], function(Entity, Timer) {
	
// 	var Squad = Entity.extend({
// 		init: function(id, kind){
// 			var self = this;

// 			this._super(id, kind);

// 			// Range
// 			this.visualRange = 0;
// 			this.attackRange = 0;

// 			// Combat
// 			this.moral = 0;
// 			this.maxMoral = 0;

// 			// Movement
// 			this.nextDestination = null;

// 			// Composition
// 			this.units = {};

// 			// Modes
// 			this.attackingMode = false;
// 			this.fleeingMode = false;
// 			this.isDecimated = false;

// 		},

// 		moveTo: function(x, y){
// 			var xOffset = 0;
// 			var yOffset = 0;
// 			for(var unit in units){
// 				unit.moveTo(x + xOffset, y + yOffset);
// 			}
// 		}

// 		addUnit: function(unit){
// 			units.push(unit);
// 		}
//     });

//     return Squad;
// });

function Squad(game, allied){
	this.game = game;

	// Position
	this.posX = 0;
	this.posY = 0;
	this.width = 50;
	this.height = 50;

	// Range
	this.visualRange = 0;
	this.attackRange = 0;

	// Combat
	this.moral = 0;
	this.maxMoral = 0;
	this.selected = false;
	this.taget = null;

	// Movement
	this.nextDestination = null;

	// Composition
	this.units = [];
	this.captain = null;

	// Modes
	this.attacking = false;
	this.fleeing = false;
	this.decimated = false;
	this.following = false;
	this.allied = allied;

	this.game.entities.push(this);

	this.test();
}

Squad.prototype.test = function(){
	this.units.push(new Square(this.game, this));
	this.units.push(new Square(this.game, this));
	this.units.push(new Square(this.game, this));
	this.units.push(new Square(this.game, this));
	this.units.push(new Square(this.game, this));
	this.units.push(new Square(this.game, this));
	this.units.push(new Square(this.game, this));

	this.captain = this.units[0];
	this.moveBanner();
}

Squad.prototype.draw = function(context){
	var center = this.captain.getCenter();

    var bite = this.getRangeZone();

	context.fillStyle = 'yellow';
    for(var spermatozoide in bite){
		context.fillRect(bite[spermatozoide].x, bite[spermatozoide].y, bite[spermatozoide].w, bite[spermatozoide].h);
    }

    context.fillStyle = 'purple';
	context.beginPath();
    context.moveTo(center.x, center.y - 50);
    context.lineTo(center.x - 20, center.y - 70);
    context.lineTo(center.x + 20, center.y - 70);
    context.fill();
}

Squad.prototype.update = function(){
	// console.log(this.attacking);	

	if(!this.decimated){
		this.move();
		// this.checkSelected();
		// this.checkCombatZone();
	}
}

Squad.prototype.move = function(){
	var center = this.captain.getCenter();	

	if(this.following)
		this.follow();

	if(this.nextDestination != null){
		if(center.x != this.nextDestination.x && center.y != this.nextDestination.y){
			this.moveTo(this.nextDestination.x, this.nextDestination.y);
		}
		else{
			this.nextDestination = null;
		}
	}
}

Squad.prototype.moveTo = function(x, y){
	var center = this.captain.getCenter();
	var directionVector = unitVector(x - center.x, y - center.y);

	for(var u in this.units){
		this.units[u].setDestination(x + u*60, y);
	}

	this.moveBanner();
}

Squad.prototype.moveBanner = function(){
	var center = this.captain.getCenter();
	
	this.posX = center.x - this.captain.width/2;
	this.posY = center.y - this.captain.height/2 - 50;
}

Squad.prototype.unselect = function(){
	this.selected = false;
}

Squad.prototype.toggleSelect = function(){
	if(this.selected == true)
		this.selected = false;
	else
		this.selected = true;
}

Squad.prototype.checkSelected = function(){
	for(var u in this.units){
		if(this.units[u].selected || this.selected){
			this.select();
		}
	}
}

Squad.prototype.select = function(){
	this.selected = true;
	for(var u in this.units){
		this.units[u].select();
	}
}

Squad.prototype.isMovable = function(){
	return true;
}

Squad.prototype.isAllied = function(){
	return this.allied;
}

Squad.prototype.setDestination = function(x, y){
	this.nextDestination = {x : x, y : y};
}

Squad.prototype.isAlliedWith = function(entity){
	return (this.allied && entity.allied) || (!this.allied && !entity.allied);
}

Squad.prototype.getCombatZone = function(){
	var output = [];

	for(var u in this.units)
		output.push(this.units[u].getCombatZone()[0]);

	return output;
}

Squad.prototype.getRangeZone = function(){
	var output = [];

	for(var u in this.units)
		output.push(this.units[u].getRangeZone());

	return output;
}

Squad.prototype.engage = function(entity){
	this.attacking = true;
	this.following = true;
	this.setTarget(entity);

	for(var u in this.units){
		this.units[u].setDestination(this.target.posX, this.target.posY);
	}
}

Squad.prototype.disengage = function(entity){
	this.attacking = false;
	this.following = false;
	this.removeTarget();
}

Squad.prototype.isAttacking = function(){
	return this.attacking;
}

Squad.prototype.follow = function(){
	var targetPos = this.getTargetPos();	

	this.nextDestination = {x : targetPos.x, y : targetPos.y}

	if(collisionBox(this.getRangeZone(), this.target.getRangeZone())){
		this.following = false;
		this.nextDestination = null;
	}
}

Squad.prototype.removeTarget = function(){
	this.target = null;
	this.nextDestination = null;

	for(var u in this.units){
		this.units[u].target = null;
		this.units[u].nextDestination = null;
	}
}

Squad.prototype.setTarget = function(entity){
	this.target = entity;
}

Squad.prototype.getTargetPos = function(){
	
	var targetPos = {};

	if(this.target){
		targetPos.x = this.target.posX;
		targetPos.y = this.target.posY;
	}

	return targetPos;
}