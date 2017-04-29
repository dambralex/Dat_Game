function Player(game, name, allied, startingX, startingY){
    this.game = game;
    this.name = name;

    this.mainTown = new Town(this.game, this, startingX, startingY);

    this.stone = 0;
    this.wood = 0;
    this.iron = 0;
    this.gold = 500;
    this.income = 0;

    this.ally = [];

    this.calculIncome();
}

Player.prototype.isAlliedWith = function(player){
	for(var a in this.ally)
		if(player == this.ally[a])
			return true;

	return false;
};

Player.prototype.tick = function(){
	this.gold += this.income;

	if(this.gold < 0)
		this.gold = 0;

}

Player.prototype.calculIncome = function(){
	this.stone = 0;
    this.wood = 0;
    this.iron = 0;
    this.income = 0;

	var resources;
	for(var t in this.game.entities.town){
		if(this.game.entities.town[t].player == this){
			resources = this.game.entities.town[t].getResources();
			this.wood += resources.wood;
			this.iron += resources.iron;
			this.stone += resources.stone;
			this.income += resources.income;
		}
	}

	if(this.stone < 0)
		this.income += this.stone;
	if(this.wood < 0)
		this.income += this.wood * 2;
	if(this.iron < 0)
		this.income += this.iron * 4;
}