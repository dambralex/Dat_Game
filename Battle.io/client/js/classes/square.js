function Square(game, squad){
	this.game = game;
	this.squad = squad;

	// Position
	this.posX = 50;
	this.posY = 50;
	this.width = 50;
	this.height = 50;

	// Speed
	this.speed = 5;

	// Pathing
	this.nextDestination = null;

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
		this.allied = false;
	this.following = false;

	// Health
	if(this.allied)
		this.hitPoints = 5000;
	else
		this.hitPoints = 50;

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

	this.game.entities.push(this);
}

Square.prototype.draw = function(context){

	if(this.showCombatZone)
		this.drawCombatZone(context);
	if(this.showRangeZone)
		this.drawRangeZone(context);

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

	context.fillRect(this.posX, this.posY, this.width, this.height);
} 

Square.prototype.drawCombatZone = function(context){
	var combatZone = this.getCombatZone();

	context.fillStyle = 'yellow';
	for(var cbz in combatZone){
		context.fillRect(combatZone[cbz].x, combatZone[cbz].y, combatZone[cbz].w, combatZone[cbz].h);
	}
}

Square.prototype.drawRangeZone = function(context){
	var rangeZone = this.getRangeZone();

	context.fillStyle = 'grey';
	context.fillRect(rangeZone.x, rangeZone.y, rangeZone.w, rangeZone.h);
}

Square.prototype.update = function(){
	// console.log(this.attacking);
    // console.log(this.target);


	if(!this.dead){
		this.move();
		this.checkCombat();
	}
}

Square.prototype.move = function(){
	var center = this.getCenter();

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

Square.prototype.moveTo = function(x, y){

	var center = this.getCenter();

	var directionVector = unitVector(x - center.x, y - center.y);

	// console.log("moving to "+directionVector.vx+" , "+directionVector.vy);
	// console.log("moving to "+this.posX+" , "+this.posY);

	this.posX += Math.round(directionVector.vx * this.speed);
	this.posY += Math.round(directionVector.vy * this.speed);

}

Square.prototype.setDestination = function(x, y){
	this.nextDestination = {x : x, y : y};
}

Square.prototype.select = function(){
	this.selected = true;
	if(this.squad)
		if(!this.squad.selected)
			this.selectSquad();
	// console.log(this.selected);
}

Square.prototype.unselect = function(){
	if(this.squad)
		if(!this.squad.selected)
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
	if(entity.squad){
		this.attacking = true;
		this.following = true;
		this.setTarget(entity);
	}
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

	if(this.death_callback) {
		this.death_callback();
    }
}

Square.prototype.hurt = function(dmg){
	this.hitPoints -= dmg;
	if(this.hitPoints <= 0){
		this.die();
	}

	console.log(this.hitPoints);

}

Square.prototype.getCenter = function(){
	var center = {x : this.posX+this.width/2, y : this.posY+this.height/2};

	return center;
}

Square.prototype.getCombatZone = function(){
	var center = this.getCenter();
	var output = [];

	var rect = {x : center.x - this.visualRange*32/2,
				y : center.y - this.visualRange*32/2,	
				w : this.visualRange*32,
				h : this.visualRange*32};

	output.push(rect);

	return output;
}

Square.prototype.getRangeZone = function(){
	var center = this.getCenter();
	var output = [];

	var rect = {x : center.x - (this.attackRange+1)*32/2,
				y : center.y - (this.attackRange+1)*32/2,	
				w : (this.attackRange+1)*32,
				h : (this.attackRange+1)*32};

	output.push(rect);

	return output;
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

	this.nextDestination = {x : targetPos.x, y : targetPos.y}

	if(collisionBox(this.getRangeZone(), this.target.getRangeZone())){
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