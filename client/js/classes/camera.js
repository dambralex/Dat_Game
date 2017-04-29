function Camera(game, posX, posY, canvasWidth, canvasHeight, worldWidth, worldHeight){
    this.game = game;

    this.posX = posX || 0;
    this.posY = posY || 0;

    this.wView = canvasWidth;
    this.hView = canvasHeight;

    this.worldBox = {x : 0, y : 0, w : worldWidth, h : worldHeight};

    this.speed = 500;
}

Camera.prototype.update = function(dt, left, top, right, bottom){
    this.viewportBox = {x : this.posX, y : this.posY, w : this.wView, h : this.hView};
    // this.posX += this.speed * dt;

    if(left){
    	this.posX -= this.speed * dt;
    	// this.posY -= this.speed * dt;
     }
    if(top){
    	this.posY -= this.speed * dt;
    	// this.posY += this.speed * dt;
    }
    if(right){
    	this.posX += this.speed * dt;
    	// this.posY += this.speed * dt;

    }
    if(bottom){
    	this.posY += this.speed * dt;
    	// this.posY -= this.speed * dt;
    }
}