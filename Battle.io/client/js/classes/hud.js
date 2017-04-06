function Hud (game){
    this.game = game;
    this.show = false;
}

Hud.prototype.draw = function(context){

    context.fillStyle = '#AAAAAA';
    context.fillRect(0, context.canvas.height - 200, context.canvas.width, context.canvas.height);
    this.show_unities(context);

}

Hud.prototype.show_unities = function(context){
    var nb = this.game.selectedEntities.length;
    var box_width = (context.canvas.width) / nb;
    for( var squad in this.game.selectedEntities)
    {
        var moral = this.game.selectedEntities[squad].moral;
        context.fillStyle = 'white';
        context.fillRect(squad * box_width, context.canvas.height - 185, box_width, 150);
        context.fillStyle = 'red';
        context.fillText("Squad " + squad + " : moral = " + moral , squad * box_width + 2, context.canvas.height - 175);
        for(var unit in this.game.selectedEntities[squad].units)
        {
            var hitpoints = this.game.selectedEntities[squad].units[unit].hitPoints;
            context.font = "10pt Verdana";
            context.fillStyle = 'darkorange';
            context.fillText("PV : "+ hitpoints, squad * box_width + 2, (context.canvas.height - 160 +(unit *15)));
        }
    }
}