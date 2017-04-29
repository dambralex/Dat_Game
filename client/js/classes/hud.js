function Hud (game){
    // var that = this;

    this.game = game;
    this.show = false;

    this.constructionButtons = [];
    this.controlButtons = [];
    this.constructionChoice = [];
}

Hud.prototype.init = function(){
    var button;

    for(var c = 0; c < 7; c++){
        button = new Button("libre", c*50 + 320, 30);
        // button.setOnClick(function(){
        //     this.pressed = true;
        // });
        this.constructionButtons.push(button);
    }

    var button = new Button("Crée une esquade de soldats mélée", 320, 130);

    button.setOnClick(function(){
        var wtf = new Square(that, null, that.selectedEntities.town.posX+that.selectedEntities.town.width/2,
                                   that.selectedEntities.town.posY+that.selectedEntities.town.height +20);
        // wtf.posX = that.selectedEntities.town.posX+that.selectedEntities.town.width/2;
        // wtf.posY = that.selectedEntities.town.posY+that.selectedEntities.town.height +20;
    });

    this.controlButtons.push(button);

    var x = 320;
    for(name in Towns["batiments"]){
        button = new Button(name, x, 80);
        button.setOnClick(function(){
            that.selectedEntities.town.buildConstruction(this.text);
        });
        this.constructionChoice.push(button);

        x = x + 50;
    }

    var button = new Button("amélioration", x, 130);

    button.setOnClick(function(){
        console.log(Towns["niveau"][this.game.selectedEntities.town.stage]["emplacements_construction"]);
        if ( that.selectedEntities.town.construction.length ==  that.selectedEntities.town.stage.emplacement_construction){
            console.log("construction d'une base plus grande, nouveau stage : " + that.selectedEntities.town.stage +1);
            that.selectedEntities.town.upgrade();
        }
        else{
            console.log("il faut plus de batiments");
        }
    });
    
    this.controlButtons.push(button);
}

Hud.prototype.draw = function(context){
    this.drawMainControl(context);
    this.drawMiniMap(context);
}

Hud.prototype.drawMainControl = function(context){
    context.save();
    context.fillStyle = '#AAAAAA';
    context.fillRect(300, 0, context.canvas.width - 300, 200);

    if(this.game.selectedEntities.squad.length <= 0){
        if(this.game.selectedEntities.town != null){
            this.drawTown(context);
        }
    }
    else {
        this.drawUnits(context);
    }

    this.drawPlayerResources(context);

    context.restore();
}

Hud.prototype.drawMiniMap = function(context){
    context.save();
    context.fillRect(0, 0, 300, 200);
    context.restore();
}

Hud.prototype.drawUnits = function(context){
    var nb = this.game.selectedEntities.squad.length;
    var box_width = (context.canvas.width - 300) / nb;
    context.save();
    for( var squad in this.game.selectedEntities.squad)
    {
        var moral = this.game.selectedEntities.squad[squad].moral;
        context.fillStyle = 'white';
        context.fillRect(squad * box_width + 300, 0, box_width, 150);
        context.fillStyle = 'red';
        context.fillText("Squad " + squad + " : moral = " + moral , squad * box_width + 302, 25);
        for(var unit in this.game.selectedEntities.squad[squad].units)
        {
            var hitpoints = this.game.selectedEntities.squad[squad].units[unit].hitPoints;
            context.font = "10pt Verdana";
            context.fillStyle = 'darkorange';
            context.fillText("PV : "+ hitpoints, squad * box_width + 302, (40 +(unit *15)));
        }
    }
    context.restore();
}

Hud.prototype.drawTown = function(context){
	context.save();
    context.fillStyle = 'black';
    context.font = "10pt Arial";
    context.fillText(this.game.selectedEntities.town.name, 320, 20);
    context.fillText("Stone : "+this.game.selectedEntities.town.stone+" "+
                     "Wood : "+this.game.selectedEntities.town.wood+" "+
                     "Iron : "+this.game.selectedEntities.town.iron+" "+
                     "Income : "+this.game.selectedEntities.town.income, 600, 20);
    context.restore();   

    this.drawTownConstruction(context);
    this.drawTownControl(context);
}

Hud.prototype.drawTownConstruction = function(context){
    for(var i in this.game.selectedEntities.town.construction){
        this.constructionButtons[i].setText(this.game.selectedEntities.town.construction[i]);
    }

    for(var c = 0; c < Towns["niveau"][this.game.selectedEntities.town.stage]["emplacements_construction"]; c++){
        this.constructionButtons[c].draw(context);
    }
}

Hud.prototype.drawTownControl = function(context){
    for(var i in this.controlButtons){
        this.controlButtons[i].draw(context);   
    }

    for(var i in this.constructionButtons){
        if(this.constructionButtons[i].pressed){
            for(var b in this.constructionChoice){
                this.constructionChoice[b].draw(context);   
            }
        }
    }
}

Hud.prototype.drawPlayerResources = function(context){
    context.save();
    context.fillStyle = 'black';
    context.font = "10pt Arial";
    

    // ajout by alex (ne marche pas : parti sur les batiments a dessiner)
    pic_stone = new Image();
    pic_wood = new Image();
    pic_iron = new Image();
    pic_income = new Image();

    pic_stone.src = './sprites/hud/ressources/stone.png';
    pic_wood.src = './sprites/hud/ressources/wood.png';
    pic_iron.src = './sprites/hud/ressources/iron.png';
    pic_income.src = './sprites/hud/ressources/gold.png';

    context.drawImage(pic_stone,0,0,128,128,320,170,128,128);
    context.drawImage(pic_wood,0,0,128,128,470,170,128,128);
    context.drawImage(pic_iron,0,0,128,128,620,170,128,128);
    context.drawImage(pic_income,0,0,128,128,770,167,128,128);
    context.fillText("Stone : "+this.game.player.stone, 360, 187);
    context.fillText("Wood : "+this.game.player.wood, 510, 187);
    context.fillText("Iron : "+this.game.player.iron, 660, 187);
    context.fillText("Gold : "+this.game.player.gold+"("+this.game.player.income+")", 810, 187);
    // done (explication : j'ai fait ca en dur, j'aurai pu faire autrement mais flemme ^^)

    //commenté pour test, marche initialement (alex)
    /*context.fillText("Stone : "+this.game.player.stone, 320, 190);
    context.fillText("Wood : "+this.game.player.wood, 420, 190);
    context.fillText("Iron : "+this.game.player.iron, 520, 190);
    context.fillText("Gold : "+this.game.player.gold+"("+this.game.player.income+")", 620, 190);*/
    context.restore();
}

Hud.prototype.handleLeftClick = function(x, y){
    for(var b in this.controlButtons){
        if(collisionBox({x : x, y : y, w : 0, h : 0}, this.controlButtons[b].getBoundingBox())){
            this.controlButtons[b].onClick();
        }
    }

    for(var b in this.constructionChoice){
        if(collisionBox({x : x, y : y, w : 0, h : 0}, this.constructionChoice[b].getBoundingBox())){
            this.constructionChoice[b].onClick();
        }
    }

    for(var b in this.constructionButtons){
        this.constructionButtons[b].unpress();
        if(this.constructionButtons[b].text == "libre"){
            if(collisionBox({x : x, y : y, w : 0, h : 0}, this.constructionButtons[b].getBoundingBox())){
                this.constructionButtons[b].togglePressed();
            }
        }
    }
}