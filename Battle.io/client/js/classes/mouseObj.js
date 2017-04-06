function MouseObj(){
	this.isDrawing = false;
	this.startX;
	this.startY;
	this.mouseX;
	this.mouseY;
}

MouseObj.prototype.draw = function(context) {
	if(this.isDrawing){
		context.strokeStyle = 'green';
		context.strokeRect(this.startX, this.startY, this.mouseX - this.startX, this.mouseY - this.startY);
	}
};