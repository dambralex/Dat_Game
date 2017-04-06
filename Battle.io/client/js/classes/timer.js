function Timer(duration, startTime){
	this.lastTime = startTime || 0;
	this.duration = duration;
}

Timer.prototype.isOver = function(time) {
	var over = false;

	if((time - this.lastTime) > this.duration) {
		over = true;
		this.lastTime = time;
	}
	return over;
};