define(function (){
	var Entity = {
		init: function(id, kind){
			var self = this;
	    
            this.id = id;
            this.kind = kind;

            // Renderer
    		this.sprite = null;
    		this.flipSpriteX = false;
        	this.flipSpriteY = false;
    		this.animations = null;
    		this.currentAnimation = null;
		
    		// Position
    		this.setGridPosition(0, 0);
		},

		setName : function(name){
			this.name = name;
		},

		setPosition: function(x, y){
			this.x = x;
			this.y = y;
		},

		setGridPosition: function(x, y){
			this.gridX = x;
			this.gridY = y;

			this.setPosition(x * 16, y * 16);
		},

		setVisible: function(value){
			this.visible = value;
		},

		isVisible: function(){
			return this.visible;
		},

		toggleVisibility: function(){
			if(this.visible){
				this.setVisible(false);
			}
			else{
				this.setVisible(true);
			}
		},

		getDistanceToEntity: function(entity){
			var distX = Math.abs(entity.gridX - this.gridX);
			var distY = Math.abs(entity.gridY - this.gridY);

			return (distX > distY) ? distX : distY;
		},

		isAdjacent: function(entity){
			var adjacent = false;

			if(entity) {
				adjacent = this.getDistanceToEntity(entity) > 1 ? false : true;
			}
			return adjacent;
		},

		isAdjacentNonDiagonal: function(entity) {
            var result = false;

            if(this.isAdjacent(entity) && !(this.gridX !== entity.gridX && this.gridY !== entity.gridY)) {
                result = true;
            }
        
            return result;
        }        
	};

	return Entity;
});