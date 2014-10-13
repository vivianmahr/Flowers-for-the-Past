define(["entities/Entity", "assets/images", "util/Point", "util/goody", "assets/vars"],
function(Entity, images, Point, goody, vars)
{    
    function MainChar(x, y, z)
    {
        Entity.Entity.call(x, y, z);
        this.image = images.BaseTiles;
        this.accel = 1.5;
        this.friction = .7;
        this._velCap = 3;
        this.rect.width = 21;
        this.rect.height = 27;
        this.xOffset = 0;
    }
    
    MainChar.prototype = new Entity.Entity();
    MainChar.prototype.constructor = MainChar;
    
    MainChar.prototype.update = function(input, map, collisionHandler)
    {
        if (input[0] + input[1] + input[2] + input[3])
        {
            if (input[0]) // up
            {   
                this.velocity.y -= this.accel;
                this.xOffset = 48;
            }
            if (input[1]) // right
            {
                this.velocity.x += this.accel;
                this.xOffset = 72;
            }
            if (input[2]) //down
            {
                this.velocity.y += this.accel;
                this.xOffset = 24;
            }
            if (input[3]) // left
            {
                this.velocity.x -= this.accel;
                this.xOffset = 0;
            }        
            //this.velocity = this.velocity.add(this.acceleration);
            if (this.velocity.length() > this._velCap)
            {
                this.velocity.setLength(this._velCap);
            }; 
            // going in the opposite direction should be more efficient than stopping
        }
        else
        {
            this.velocity.mult(this.friction);
        }
        this.move(map, collisionHandler);
    }
    
    MainChar.prototype.drawImage = function(ctx, offset)
    {
        ctx.drawImage(
            this.image,                                                 //image
            this.xOffset,                                               //x position on image
            0,                                                          //y position on image
            24,                                                         //imageWidth on Source
            48,                                                         //imageHeight on Source
            this.rect.position.x + offset.x - 3,                        //xPosCanvas    
            this.rect.position.y + offset.y - 24,                       //yPosCanvas, integer offsets are for centering  
            24,                                                         //imageWidth on Canvas
            48                                                          //imageHeight on Canvas                
        )
    }
    
    MainChar.prototype.move = function(map, collisionHandler)
    {
        var dx = this.velocity.x;
        var dy = this.velocity.y;
        var currentTiles = collisionHandler.collidingTiles(map, this.rect);

        this.rect.position.x += dx;
        var newTiles = collisionHandler.collidingTiles(map, this.rect);

        for (var i = 0; i < newTiles.length; i++) {
            if (!goody.inArray(currentTiles, newTiles[i])) {
                var newTile = newTiles[i];
                if (map.getHeight(newTile) > this.movementAttributes.height) {
                    if (dx > 0) // moving right, hit left side of wall
                    {
                        this.rect.setRight(map.tileToPixel(newTile).x-1);
                    }
                    else if (dx < 0) // moving left, hit right side of wall
                    {
                        this.rect.setLeft(map.tileToPixel(newTile).x+vars.tileDimension+1);
                    }
                }
            }
        }

        currentTiles = collisionHandler.collidingTiles(map, this.rect);

        this.rect.position.y += dy;
        newTiles = collisionHandler.collidingTiles(map, this.rect);

        for (var i = 0; i < newTiles.length; i++) {
            if (!goody.inArray(currentTiles, newTiles[i])) {
                newTile = newTiles[i]
                if (map.getHeight(newTile) > this.movementAttributes.height) {
                    if (dy > 0) // moving down, hit top side of wall
                    {
                        this.rect.setBottom(map.tileToPixel(newTile).y-1);
                    }
                    else if (dy < 0) // moving up, hit bottom side of wall
                    {
                        this.rect.setTop(map.tileToPixel(newTile).y+vars.tileDimension+1);
                    }
                }
            }
        }

        // for (var i = 0; i < wallLength; i++)
        // {
        //     if (this.rect.collideRect(walls[i]))
        //     {
        //         if (dx > 0) // moving right, hit left side of wall
        //         {
        //             this.rect.setRight(walls[i].getLeft()-1);
        //         }
        //         else if (dx < 0) // moving left, hit right side of wall
        //         {
        //             this.rect.setLeft(walls[i].getRight()+1);
        //         }
        //     }
        // }
        
        // this.rect.position.y += dy;

        // for (var i = 0; i < wallLength; i++)
        // {
        //     if (this.rect.collideRect(walls[i]))
        //     {
        //         if (dy > 0) // moving down, hit top side of wall
        //         {
        //             this.rect.setBottom(walls[i].getTop()-1);
        //         }
        //         else if (dy < 0) // moving up, hit bottom side of wall
        //         {
        //             this.rect.setTop(walls[i].getBottom()+1);
        //         }
        //     }
        // }
    }
    
    return {
        MainChar: MainChar
    };
});