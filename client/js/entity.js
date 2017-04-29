class Entity{
	constructor(game, allied, posX, posY, width, height){
		this.game = game;

		//Position
		this.posX = posX || 0;
		this.posY = posY || 0;
		this.width = width || 0;
		this.height = height || 0;
	}
}