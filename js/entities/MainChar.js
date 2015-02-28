define(["display/Animation", "entities/Entity", "physics/Vector", "lib/goody", "assets/vars"],
function(Animation, Entity, Vector, goody, vars)
{    
    MainChar.prototype = new Entity.Entity();
    MainChar.prototype.constructor = MainChar;

    function MainChar(x, y, z) {
        Entity.Entity.apply(this, arguments);
        this._accel = 1.5;
        this._velCap = 3;
        this._friction = .7;
        this._floatOffset = 0;        // image offsets as a result of flying and sinking
        this._targetFloatOffset = 0;  // target image offset at min/max height
        this._sprite = new Animation.Animation(images.MC, 1, 24, 48);
        this._shadowSprite = new Animation.Animation(images.MCshadow, 1, 20, 8);

        this.rect.width = 21;
        this.rect.height = 27;
    }

    MainChar.prototype.setPosition = function(x, y) {
        this.rect.setLeft(x);
        this.rect.setTop(y);
    }

    MainChar.prototype.update = function(input, map, collisionHandler, timeDelta) {
        // if moving 
        if (input.up||input.down||input.right||input.left) {
            // TODO = Better orientation based on dx and dy
            if (input.up) {   
                this.velocity.y -= this._accel;
            }
            if (input.right) {
                this.velocity.x += this._accel;
            }
            if (input.down) {
                this.velocity.y += this._accel;
            }
            if (input.left) {
                this.velocity.x -= this._accel;
            }        
            if (this.velocity.length() > this._velCap) {
                this.velocity.setLength(this._velCap);
            }; 
        }
        else {
            this.velocity.mult(this._friction);
        }
        var angle = 180 * this.velocity.getDirection() / Math.PI;
        if (angle < 0) {angle += 360;}
        if (angle > 22.5 && angle < 122.5) {
            this._sprite.orient("D");
        }
        else if (angle > 202.5 && angle < 292.5) {
            this._sprite.orient("U");
        }
        else if (angle > 122.5 && angle < 202.5) {
            this._sprite.orient("L");;
        }
        else {
            this._sprite.orient("R");
        }
        this._handleFloatOffset(map, collisionHandler);
        this._move(map, collisionHandler, timeDelta);
        this._sprite.update();
    }

    MainChar.prototype._handleFloatOffset = function(map, collisionHandler) {
        // If the float offset isn't exactly there but it's close enough
        if (this._floatOffset !== this._targetFloatOffset) {
            if (Math.abs(this._floatOffset - this._targetFloatOffset) < 0.5) {
                // MC is falling down, have to set height
                // TODO - What happens if you're floating and you go to a tile that's
                // a lot lower than you...? same for sinking
                var currentTiles = collisionHandler.collidingTiles(map, this.rect);
                var maxHeight = -1;
                for (var i = 0; i < currentTiles.length; i++) {
                    var tileHeight = map.getHeight(currentTiles[i]);
                    maxHeight = tileHeight > maxHeight ? tileHeight : maxHeight; 
                }
                // MC is climbing up, 
                if (this.movementAttributes.temperature === 1) {
                    this.movementAttributes.sinking = false;
                    this.movementAttributes.airborne = false;
                }
                else if (this._floatOffset < this._targetFloatOffset) {
                    this.movementAttributes.airborne = false;
                }
                // MC is sinking
                else {
                    this.movementAttributes.sinking = false;
                }
                // On a temp tile, had to be going up
                this.movementAttributes.height = tileHeight;                     
                this._floatOffset = this._targetFloatOffset;
            }
            else {
                this._floatOffset += (this._targetFloatOffset - this._floatOffset)/2;
            }
        }
    }
    
    MainChar.prototype.drawImage = function(ctx, offset) {
        this._shadowSprite.display(ctx, new Vector.Vector(this.rect.position.x + offset.x - 3, this.rect.position.y + offset.y + 18))
        this._sprite.display(ctx, new Vector.Vector(this.rect.position.x + offset.x - 3, this.rect.position.y + offset.y - 24 + this._floatOffset))
        // this.rect.draw(ctx, offset);
    }
    
    MainChar.prototype._move = function(map, collisionHandler, timeDelta) {
        this.moveAxis("x", this.velocity.x * timeDelta/9, collisionHandler, map);
        this.moveAxis("y", this.velocity.y * timeDelta/9, collisionHandler, map);
    }

    MainChar.prototype.moveAxis = function(axis, distance, collisionHandler, map) {
        var isXaxis = axis === "x";
        var currentTiles = collisionHandler.collidingTiles(map, this.rect);
        // Move forward the right position area, then look at the tiles the rect is on
        // and see if there are any new tile effects to be applied
        if (isXaxis) { 
            this.rect.position.x = goody.cap(this.rect.position.x + distance, 0, map.pixelWidth - this.rect.width - 1); 
        } 
        else { 
            this.rect.position.y = goody.cap(this.rect.position.y + distance, 0, map.pixelHeight - this.rect.height - 1); 
        }
        var newTiles = collisionHandler.collidingTiles(map, this.rect);
        // See if you're on any new tiles
        for (var i = 0; i < newTiles.length; i++) {
            // If the one of the new tiles was just stepped onto
            if (!goody.inArray(currentTiles, newTiles[i])) { 
                var newTile = newTiles[i];
                // Height processing is first - if MC can't reach the tile, don't bother checking for effects
                var heightDifference = map.getHeight(newTile) - this.movementAttributes.height;
                console.log(map.getHeight(newTile), this.movementAttributes.height);
                var sink = this.movementAttributes.sinking;
                var fly = this.movementAttributes.airborne;
                // Do nothing if you're walking on flat ground or a slight incline
                // Do nothing if you're not airborne or the height difference is nothing doable
                if ((map.isJump(newTile) || (Math.abs(heightDifference) > 1)) && heightDifference <= 2) {
                    if (sink && heightDifference > -3 && heightDifference <= 0 ) {
                        this.applyHumChange(map, newTile);
                        this.applyTempChange(map, newTile);
                    }
                    else if (fly && heightDifference < 3 && heightDifference > 0) {
                        this.applyHumChange(map, newTile);
                        this.applyTempChange(map, newTile);
                    }
                    else {
                        this.moveBack(isXaxis, distance, newTile, map);
                    }
                }
                else {
                    this.applyHumChange(map, newTile);
                    this.applyTempChange(map, newTile);
                }
            }
        }
    }

    MainChar.prototype.applyTempChange = function(map, newTile) {
        var oldTemp = this.movementAttributes.temperature;
        var newTemp = map.getElement(newTile, "Temperature");
        if (newTemp != oldTemp) {
            this.movementAttributes.temperature = newTemp;
            if (newTemp === 2) { // heat
                this.movementAttributes.airborne = true;
                this._targetFloatOffset = -20;
            } 
            else if (newTemp === 1) { // neutral
                this._targetFloatOffset = 0;
            }
            else { // cold
                this.movementAttributes.sinking = true;
                this._targetFloatOffset = 20;
            }
        }
    }

    MainChar.prototype.applyHumChange = function(map, newTile) {
        var oldHumidity = this.movementAttributes.humidity;
        var newHumidity = map.getElement(newTile, "Humidity");
        this.movementAttributes.humidity = newHumidity;
        this.velCap = this.velCap * Math.pow(3, (newHumidity - oldHumidity));
     }

    MainChar.prototype.moveBack = function(isXaxis, distance, newTile, map){
        // moving right, hit left side of wall
        if (isXaxis && distance > 0) {
            this.rect.setRight(map.tileToPixel(newTile).x-1);
        }
        // moving left, hit right side of wall
        else if (isXaxis && distance < 0) {
            this.rect.setLeft(map.tileToPixel(newTile).x+vars.tileDimension+1);
        }
        // moving down, hit top side of wall
        else if (distance > 0) {
            this.rect.setBottom(map.tileToPixel(newTile).y-1);
        }
        // moving up, hit bottom side of wall
        else {
            this.rect.setTop(map.tileToPixel(newTile).y+vars.tileDimension+1);
        } 
    }
    
    return {
        MainChar: MainChar
    };
});