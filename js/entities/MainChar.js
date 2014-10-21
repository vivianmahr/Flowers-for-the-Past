define(["display/Animation", "entities/Entity", "assets/images", "util/Point", "util/goody", "assets/vars"],
function(Animation, Entity, images, Point, goody, vars)
{    
    function MainChar(x, y, z)
    {
        Entity.Entity.call(this, x, y, z);
        this.image = images.BaseTiles;
        this.velCap = 3;
        this.friction = .7;
        this.accel = 1.5;
        this.rect.width = 21;
        this.rect.height = 27;
        this.floatOffset = 0;
        this.targetFloatOffset = 0;
        this.sprite = new Animation.Animation(images.MC, 4, 24, 48);
    }
      
    MainChar.prototype = new Entity.Entity();
    
    MainChar.prototype.update = function(input, map, collisionHandler, timeDelta)
    {
        if (input[0] + input[1] + input[2] + input[3])
        {
            if (input[0]) // up
            {   
                this.velocity.y -= this.accel;
                this.sprite.orient("U");
            }
            if (input[1]) // right
            {
                this.velocity.x += this.accel;
                this.sprite.orient("R");
            }
            if (input[2]) //down
            {
                this.velocity.y += this.accel;
                this.sprite.orient("D");
            }
            if (input[3]) // left
            {
                this.velocity.x -= this.accel;
                this.sprite.orient("L");
            }        
            //this.velocity = this.velocity.add(this.acceleration);
            if (this.velocity.length() > this.velCap)
            {
                this.velocity.setLength(this.velCap);
            }; 
            // should going in the opposite direction should be more efficient than stopping
        }
        else
        {
            this.velocity.mult(this.friction);
        }
        if (this.floatOffset !== this.targetFloatOffset && Math.abs(this.floatOffset - this.targetFloatOffset) < 0.5) {
            // ^ If it's close enough to being exact or the same
            this.floatOffset = this.targetFloatOffset;
            if (this.movementAttributes.temperature != 2) // falling to ground level I'm not sure if this should be not 0
            {
                var currentTiles = collisionHandler.collidingTiles(map, this.rect);
                var currentHeights = [];
                for (var i=0; i<currentTiles.length; i++) {
                    var tileHeight = map.getHeight(currentTiles[i]);
                    if (!goody.inArray(currentHeights, tileHeight)) {
                        currentHeights.push(tileHeight);
                    }
                }   
                this.movementAttributes.airborne = false;
                this.movementAttributes.height = Math.max.apply(Math, currentHeights); // highest height you're sitting on

            }
        }
        else 
        {
            this.floatOffset += (this.targetFloatOffset - this.floatOffset)/2;
        }
        this.move(map, collisionHandler, timeDelta);
        // fuck shaking
        this.sprite.update();
    }
    
    MainChar.prototype.drawImage = function(ctx, offset)
    {
        this.sprite.display(ctx, new Point.Point(this.rect.position.x + offset.x - 3, this.rect.position.y + offset.y - 24 + this.floatOffset))
    }
    
    MainChar.prototype.move = function(map, collisionHandler, timeDelta)
    {
        this.moveAxis("x", this.velocity.x * timeDelta/9, collisionHandler, map);
        this.moveAxis("y", this.velocity.y * timeDelta/9, collisionHandler, map);
    }

    MainChar.prototype.moveAxis = function(axis, distance, collisionHandler, map) {
        var isXaxis = axis === "x";
        var currentTiles = collisionHandler.collidingTiles(map, this.rect);

        if (isXaxis) { 
            this.rect.position.x = goody.cap(this.rect.position.x+distance, 0, map.pixelWidth-this.rect.width-1); 
        } 
        else { 
            this.rect.position.y = goody.cap(this.rect.position.y+distance, 0, map.pixelHeight-this.rect.height-1); 
        }

        var newTiles = collisionHandler.collidingTiles(map, this.rect);

        for (var i = 0; i < newTiles.length; i++) {
            if (!goody.inArray(currentTiles, newTiles[i])) { // There's a new tile effect to be applied
                var newTile = newTiles[i];
                // Height processing is first - if MC can't reach the tile, don't bother checking for effects
                var heightDifference = map.getHeight(newTile) - this.movementAttributes.height;
                if (this.movementAttributes.airborne && (heightDifference === 2 || heightDifference === 3)) {
                    this.applyTempChange(map, newTile);
                    continue;
                }
                if (map.isJump(newTile) && !this.movementAttributes.airborne){
                    this.moveBack(isXaxis, distance, newTile, map);
                    continue;
                }
                if (map.getHeight(newTile) - this.movementAttributes.height >= 2 ) {
                    this.moveBack(isXaxis, distance, newTile, map);
                    continue;
                }
                if (!this.movementAttributes.airborne && (map.getHeight(newTile) - this.movementAttributes.height <= -2) ) {
                    this.moveBack(isXaxis, distance, newTile, map);
                    continue;
                }
                // Elememtal effect needs to be applied and possibly height
                // unsure to growth effects, but they will probably be applied first or last
                // var growthEffect = map.getElement(newTile, "Growth") != this.movementAttributes.growth;
                this.movementAttributes.height = map.getHeight(newTile);
                var humEffect = map.getElement(newTile, "Humidity") != this.movementAttributes.humidity;
                var tempEffect = map.getElement(newTile, "Temperature") != this.movementAttributes.temperature;

                // if (growthEffect) {console.log("growth");}
                if (humEffect) {
                    this.applyHumChange(map, newTile);
                }
                if (tempEffect) {
                    this.applyTempChange(map, newTile);
                }
            }
        }
    }

    MainChar.prototype.applyTempChange = function(map, newTile) {
        var oldTemp = this.movementAttributes.temperature;
        var newTemp = map.getElement(newTile, "Temperature");
        this.movementAttributes.temperature = newTemp;
        if (newTemp != oldTemp)
        {
            if (newTemp === 2) { // heat
                this.movementAttributes.airborne = true;
                this.movementAttributes.height = map.getHeight(newTile) + 3;
                this.targetFloatOffset = -20;
            } 
            else if (newTemp === 1) //neutral
            {
                this.targetFloatOffset = 0;
            }
            else {
                this.movementAttributes.sinking = true;
                this.targetFloatOffset = 20;
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
        if (isXaxis && distance > 0) // moving right, hit left side of wall
        {
            this.rect.setRight(map.tileToPixel(newTile).x-1);
        }
        else if (isXaxis && distance < 0) // moving left, hit right side of wall
        {
            this.rect.setLeft(map.tileToPixel(newTile).x+vars.tileDimension+1);
        }
        else if (distance > 0) // moving down, hit top side of wall
        {
            this.rect.setBottom(map.tileToPixel(newTile).y-1);
        }
        else // moving up, hit bottom side of wall
        {
            this.rect.setTop(map.tileToPixel(newTile).y+vars.tileDimension+1);
        } 
    }
    
    return {
        MainChar: MainChar
    };
});