function Square(game, squad, posX, posY){
	this.game = game;
	this.squad = squad;

	// Position
	this.posX = posX;
	this.posY = posY;
	this.width = 50;
	this.height = 50;

	// Speed
	this.speed = 200;

	// Pathing
	this.nextDestination = null;
	this.path = [];

	// Combat
	this.selected = false;

	// Modes
	this.movable = true;
	this.ranged = false;
	this.attacking = false;
	this.dead = false;

	if(this.squad)
		this.allied = this.squad.allied
	else
		this.allied = true;
	this.following = false;

	// Health
	if(this.allied)
		this.hitPoints = 5000;
	else
		this.hitPoints = 500;

	this.maxHitPoints = 0;

	// Combat
	this.target = null;
	this.attackers = {};
	this.setAttackRate(1000);

	this.attackCallback = null;

	// Range
	this.attackRange = 1;
	this.visualRange = 10;

	// Zones drawing
	this.showCombatZone = false;
	this.showRangeZone = false;
	this.showPath = false;

	this.game.entities.unit.push(this);
}

Square.prototype.draw = function(context, xView, yView){
	context.save();	

	if(this.showCombatZone)
		this.drawCombatZone(context);
	if(this.showRangeZone)
		this.drawRangeZone(context);
	if(this.showPath)
		this.drawPath(context);

	if(this.selected && !this.allied)
		context.fillStyle = 'pink';
	else if(this.dead)
		context.fillStyle = 'black';
	else if(this.selected)
		context.fillStyle = 'green';
	else if(!this.allied)
		context.fillStyle = 'red';
	else
		context.fillStyle = 'blue';

	var screenPosition = this.getScreenPosition(xView, yView);
	
	context.fillRect(screenPosition.x, screenPosition.y, this.width, this.height);
	context.restore();
} 

Square.prototype.getScreenPosition = function(xView, yView){
	return {x : this.posX + this.posY * -1 - xView * 2, y : this.posX * 0.5 + this.posY*0.5 - yView};
}

Square.prototype.drawCombatZone = function(context){
	context.save();	

	var combatZone = this.getCombatZone();

	context.fillStyle = 'yellow';
	context.fillRect(combatZone.x, combatZone.y, combatZone.w, combatZone.h);

	context.restore();

}

Square.prototype.drawRangeZone = function(context){
	context.save();	

	var rangeZone = this.getRangeZone();

	context.fillStyle = 'grey';
	context.fillRect(rangeZone.x, rangeZone.y, rangeZone.w, rangeZone.h);

	context.restore();

}

Square.prototype.drawPath = function(context){

	context.save();

	if(this.nextDestination != null){
		if(this.allied){
			context.strokeStyle = 'green';
		}
		else{
			context.strokeStyle = 'red';
		}
		
		var center = this.getCenter();

		context.moveTo(center.x, center.y);
		context.lineTo(this.nextDestination.x, this.nextDestination.y);
	
		context.stroke();
	}
	context.restore();

}

Square.prototype.update = function(delta){
	// console.log(this.attacking);
    // console.log(this.target);
	if(!this.dead){
		this.move(delta);
		this.checkCombat();
	}
}

Square.prototype.move = function(delta){
	var center = this.getCenter();
	if(this.following)
		this.follow();
	if(this.nextDestination != null && !this.attacking){
		if(length(center.x - this.nextDestination.x, center.y - this.nextDestination.y) > 4){
			this.moveTo(this.nextDestination.x, this.nextDestination.y, delta);
		}
		else{	
			if(this.path.length > 0){
				var nextInPath = this.path.shift();
				this.nextDestination = {x : nextInPath.x, y : nextInPath.y};
			}
			else{
				this.nextDestination = null;
			}
		}
	}
}

Square.prototype.moveTo = function(x, y, delta){

	var center = this.getCenter();

	var directionVector = unitVector(x - center.x, y - center.y);

	// console.log("moving to "+directionVector.vx+" , "+directionVector.vy);
	// console.log("moving to "+this.posX+" , "+this.posY);

	this.posX += Math.round(directionVector.vx * this.speed * delta);
	this.posY += Math.round(directionVector.vy * this.speed * delta);

}

Square.prototype.setDestination = function(x, y){
	var that = this;
	if(window.Worker) {
		var worker = new Worker("http://localhost:8080/js/worker.js");
		//console.log("Envoi message au worker");
		worker.postMessage([this.posX, this.posY, x, y, this.game.map.walls, this.game.map.getWidth(), this.game.map.getHeight(), 32]);
		
		worker.onmessage = function(path) {
			//console.log("Message reçu de la part du worker");
			that.path = path.data.slice(0);
			
			var nextInPath = that.path.shift();
			that.nextDestination = {x : nextInPath.x, y : nextInPath.y};
		}
		
		
	
	}
	//this.path = getPath(this.posX, this.posY, x, y, this.game.map.walls, this.game.map.getWidth()*32, this.game.map.getHeight()*32, 32);
	//var nextInPath = this.path.shift();
		//		this.nextDestination = {x : nextInPath.x, y : nextInPath.y};
	// Pathfind
}

Square.prototype.select = function(){
	this.selected = true;
	// console.log(this.selected);
}

Square.prototype.unselect = function(){
	this.selected = false;
}

Square.prototype.toggleSelect = function(){
	if(this.selected == true)
		this.selected = false;
	else
		this.selected = true;
}

Square.prototype.selectSquad = function(){
	this.squad.select();
}

Square.prototype.isMovable = function(){
	return this.movable;
}

Square.prototype.setAttackRate = function(rate){
	this.attackCooldown = new Timer(rate);
}

Square.prototype.setMaxHitPoints = function(hp){
	this.maxHitPoints = hp;
	this.hitPoints = hp;
}

Square.prototype.engage = function(entity){
	// this.attacking = true;
	this.following = true;
	this.setTarget(entity);
}

Square.prototype.disengage = function(entity){
	this.attacking = false;
	this.following = false;
	this.removeTarget();
}

Square.prototype.isAttacking = function(){
	return this.attacking;
}

Square.prototype.die = function(){
	this.dead = true;

	if(this.deathCallback) {
		this.deathCallback();
    }
}

Square.prototype.hurt = function(dmg){
	this.hitPoints -= dmg;
	if(this.hitPoints <= 0){
		this.die();
	}

	// console.log(this.hitPoints);

}

Square.prototype.getCenter = function(){
	var xView = this.game.camera.posX;
	var yView = this.game.camera.posY;

	var center = {x : this.posX, y : this.posY};
	// var center = {x : this.posX + this.posY * -1 +this.width/2, y :  this.posX * 0.5 + this.posY*0.5 +this.height/2};

	return center;
}

Square.prototype.getCombatZone = function(){
	var center = this.getCenter();

	var rect = {x : center.x - this.visualRange*32/2,
				y : center.y - this.visualRange*32/2,	
				w : this.visualRange*32,
				h : this.visualRange*32};

	return rect;
}

Square.prototype.getRangeZone = function(){
	var center = this.getCenter();

	var rect = {x : center.x - (this.attackRange+1)*32/2,
				y : center.y - (this.attackRange+1)*32/2,	
				w : (this.attackRange+1)*32,
				h : (this.attackRange+1)*32};

	return rect;
}

Square.prototype.checkCombat = function(){
	if(this.target)
		if(this.target.dead)
			this.disengage();
		else{
			if(this.attackCooldown.isOver(Date.now()) && collisionBox(this.getRangeZone(), this.target.getRangeZone()))
				this.target.hurt(50);
		}
}

Square.prototype.isAlliedWith = function(entity){
	if((this.allied && entity.allied) || (!this.allied && !entity.allied)){
		return true;
	}

	return false;
}

Square.prototype.isAllied = function(){
	return this.allied;
}

Square.prototype.setTarget = function(entity){
	this.target = entity;
}

Square.prototype.follow = function(){
	var targetPos = this.getTargetPos();	

	setDestination(targetPos.x, targetPos.y);

	if(collisionBox(this.getRangeZone(), this.target.getSize())){
		this.attacking = true;
		this.following = false;
		this.nextDestination = null;
	}
}

Square.prototype.getTargetPos = function(){
	
	var targetPos = {};

	if(this.target){
		targetPos.x = this.target.posX;
		targetPos.y = this.target.posY;
	}

	return targetPos;
}

Square.prototype.removeTarget = function(){
	this.target = null;
	this.nextDestination = null;
}

Square.prototype.getSize = function(){
	var box = {x : this.posX, y : this.posY, w : this.width, h : this.height};	

	return box;
}
