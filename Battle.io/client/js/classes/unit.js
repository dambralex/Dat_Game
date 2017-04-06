define(['entity', 'timer'], function(Entity, Timer) {
	
	var Unit = Entity.extend({
		init: function(id, kind){
			var self = this;

			this._super(id, kind);

			// Position and orientation
			this.posX = 0;
			this.posY = 0;
			this.orientation = Types.orientation.DOWN;

			// Speed
			this.speed = 60;
			this.setAttackRate(800);

			// Pathing
			this.nextDestination = null;

			// Combat
			this.target = null;
			this.attackers = {};

			// Health
			this.hitPoints = 0;
			this.maxHitPoints = 0;

			// Range
			this.attackRange = 10;
			this.visualRange = 50;

			// Modes
			this.isDead = false;
			this.attackingMode = false;
			this.ranged = false;
		},

		moveTo : function(x, y, dt){
			var directionVector = unitVector(x - this.posX, y - this.posY);

			this.posX = directionVector.vx * speed * dt;
			this.posY = directionVector.vy * speed * dt;
		}

		clean: function(){
			this.forEachAttacker(function(attacker){
				attacker.disengage();
				attacker.idle();
			});
		},

		setMaxHitPoints : function(hp){
			this.maxHitPoints = hp;
			this.hitPoints = hp;
		},

		turnTo: function(orientation) {
            this.orientation = orientation;
            this.idle();
        },
	
    	setOrientation: function(orientation) {
    	    if(orientation) {
    	        this.orientation = orientation;
    	    }
    	},
	
    	idle: function(orientation) {
    	    this.setOrientation(orientation);
    	},
	
    	hit: function(orientation) {
    	    this.setOrientation(orientation);
    	},
	
    	walk: function(orientation) {
    	    this.setOrientation(orientation);
    	},

    	engage: function(character) {
            this.attackingMode = true;
            this.setTarget(character);
            this.follow(character);
        },
    
        disengage: function() {
            this.attackingMode = false;
            this.followingMode = false;
            this.removeTarget();
        },

        isAttacking: function() {
            return this.attackingMode;
        },

        isAttackedBy: function(character) {
            return (character.id in this.attackers);
        },

        addAttacker: function(character) {
            if(!this.isAttackedBy(character)) {
                this.attackers[character.id] = character;
            } else {
                log.error(this.id + " is already attacked by " + character.id);
            }
        },

        removeAttacker: function(character) {
            if(this.isAttackedBy(character)) {
                delete this.attackers[character.id];
            } else {
                log.error(this.id + " is not attacked by " + character.id);
            }
        },

        die: function() {
    	    this.isDead = true;
	    
    	    if(this.death_callback) {
    	        this.death_callback();
    	    }
    	},

        hurt: function(dmg){
        	this.hitPoints -= dmg;
        	if(this.hitPoints <= 0){
        		this.die();
        	}
        },

        setAttackRate: function(rate) {
        	this.attackCooldown = new Timer(rate);
        },

        forEachAttacker: function(callback) {
            for(var attacker in this.attackers){
                callback(attacker);
            };
        }

	});

	return Unit;
});