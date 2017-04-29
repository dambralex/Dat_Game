var unitVector = function(x, y){
	var vector = {vx : 0, vy : 0};
	var lengthVector = length(x, y);

	if(x != 0){
		vector.vx = x/lengthVector;
	}
	if(y != 0){
		vector.vy = y/lengthVector;
	}

	return vector;
}

function length(x, y){
	return Math.sqrt(x * x + y * y);
}

function collisionBox(box1, box2){

	normalizeBox(box1);
	normalizeBox(box2);

	if(
    (box2.x >= box1.x + box1.w)      // trop à droite
	|| (box2.x + box2.w <= box1.x) // trop à gauche
	|| (box2.y >= box1.y + box1.h) // trop en bas
	|| (box2.y + box2.h <= box1.y))  // trop en haut
        return false; 
   else
        return true; 
}

function collisionBoxes(boxes1, boxes2){
	var result = false;

	for(var b1 in boxes1){
		for(var b2 in boxes2){
			if(b1 != b2){
				if(collisionBox(boxes1[b1], boxes2[b2])){
					result = true;
				}
			}
		}
	}

	return result;
}

function normalizeBox(box){
	var nBox = box;

	if(box.w < 0){
		nBox.x = box.x + box.w;
		nBox.w = Math.abs(box.w);
	}
	if(box.h < 0){
		nBox.y = box.y + box.h;
		nBox.h = Math.abs(box.h);
	}

	box = nBox;
}

var Buildings = {
	"Scierie" : {
		time : 5000,
		stone : 0,
		wood : 8,
		iron : 0,
		income : 0
	}
}