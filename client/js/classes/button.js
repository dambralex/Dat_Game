// function Button(text, posX, posY){
// 	this.posX = posX || 0;
// 	this.posY = posY || 0;
// 	this.pressed = false;
// 	this.showButton = true;

// 	this.text = text || "";
// }

// Button.prototype.press = function(){
// 	this.pressed = true;
// 	this.onClick();
// }

// Button.prototype.unpress = function(){
// 	this.pressed = false;
// }

// Button.prototype.setPosition = function(x, y){
// 	this.posX = x;
// 	this.posY = y;
// }

// Button.prototype.draw = function(context){
// 	context.save()
// 	if(this.showButton){
// 		if(!this.pressed){
// 			context.strokeStyle = 'purple';
// 			context.strokeRect(this.posX, this.posY, 40, 40);
// 			if(this.text){
// 				context.fillStyle = 'purple';
//     			context.font = "8pt Arial";
//     			context.fillText(this.text, this.posX+5, this.posY+20);
// 			}
// 		}
// 		else{
// 			context.fillStyle = 'purple';
// 			context.fillRect(this.posX, this.posY, 40, 40);
// 			if(this.text){
// 				context.fillStyle = 'white';
//     			context.font = "8pt Arial";
//     			context.fillText(this.text, this.posX+5, this.posY+20);
// 			}
// 		}
// 	}
// 	context.restore();
// }

// Button.prototype.onClick = function(){
// 	if(this.clickCallback){
// 		this.clickCallback();
// 	}
// }

// Button.prototype.togglePressed = function(){
// 	if(this.pressed == true)
// 		this.pressed = false;
// 	else
// 		this.pressed = true;
// }

// Button.prototype.setOnClick = function(callback){
// 	this.clickCallback = callback;
// }

// Button.prototype.setText = function(text){
// 	this.text = text;
// }

class Button{
	constructor(text, posX, posY){
		var self = this;

		this.posX = posX || 0;
		this.posY = posY || 0;
		this.pressed = false;
		this.showButton = true;

		this.text = text || "";
	}

	press(){
		this.pressed = true;
		this.onClick();
	}

	unpress(){
		this.pressed = false;
	}

	setPosition(x, y){
		this.posX = x;
		this.posY = y;
	}

	draw(context){
		context.save()
		if(this.showButton){
			if(!this.pressed){
				context.strokeStyle = 'purple';
				context.strokeRect(this.posX, this.posY, 40, 40);
				if(this.text){
					context.fillStyle = 'purple';
   	 				context.font = "8pt Arial";
   	 				context.fillText(this.text, this.posX+5, this.posY+20);
				}
			}
			else{
				context.fillStyle = 'purple';
				context.fillRect(this.posX, this.posY, 40, 40);
				if(this.text){
					context.fillStyle = 'white';
   		 			context.font = "8pt Arial";
    				context.fillText(this.text, this.posX+5, this.posY+20);
				}
			}
		}
		context.restore();
	}

	onClick(){
		if(this.clickCallback){
			this.clickCallback();
		}
	}

	togglePressed(){
		if(this.pressed == true)
			this.pressed = false;
		else
			this.pressed = true;
	}

	setOnClick(callback){
		this.clickCallback = callback;
	}

	setText(text){
		this.text = text;
	}

	getBoundingBox(){
		return {x : this.posX, y : this.posY, w : 40, h : 40};
	}
}