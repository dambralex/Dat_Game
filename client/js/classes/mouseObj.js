function MouseObj(){
	this.isDrawing = false;
	this.outLeft = false;
	this.outTop = false;
	this.outRight = false;
	this.outBottom = false;
	this.startX;
	this.startY;
	this.mouseX;
	this.mouseY;
	this.cameraX;
	this.cameraY;
}

MouseObj.prototype.draw = function(context, xView, yView) {
	if(this.isDrawing){
		context.strokeStyle = 'green';
		context.strokeRect(this.startX + this.getXOffset(xView, 2),
						   this.startY + this.getYOffset(yView, 2),
						   this.mouseX - this.startX - this.getXOffset(xView, 2),
						   this.mouseY - this.startY - this.getYOffset(yView, 2));
	}
};

MouseObj.prototype.setIsDrawing = function(state, xView, yView){
	this.isDrawing = state;
	this.cameraX = xView;
	this.cameraY = yView;
}

MouseObj.prototype.setOutLeft = function(state){
	this.outLeft = state;
}

MouseObj.prototype.setOutTop = function(state){
	this.outTop = state;
}

MouseObj.prototype.setOutRight = function(state){
	this.outRight = state;
}

MouseObj.prototype.setOutBottom = function(state){
	this.outBottom = state;
}

MouseObj.prototype.getXOffset = function(xView, coef){
	return (this.cameraX - xView) * 2;
}

MouseObj.prototype.getYOffset = function(yView,coef){
	return (this.cameraY - yView) * 2;
}

MouseObj.prototype.getSelectionBox = function(xView, yView){
	return {
		x : this.startX + this.getXOffset(xView, 2),
		y : this.startY + this.getYOffset(yView, 2),
		w : this.mouseX - this.startX - this.getXOffset(xView, 2),
		h : this.mouseY - this.startY - this.getYOffset(yView, 2)
	}
}