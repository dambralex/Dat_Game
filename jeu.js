window.onload = function() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	
	ctx.fillStyle = 'blue';
	ctx.fillRect(10, 10, 100, 50);
	
	ctx.strokeStyle = 'red';
	ctx.strokeRect(75, 75, 50, 50);
}
