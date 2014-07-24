define(["entities/Entity", "assets/images", "util/Point", "util/goody", "assets/vars"],
function(Entity, images, Point, goody, vars)
{    
    function MainChar(x, y, z)
    {
        Entity.Entity.call(x, y);
        this.z = goody.optional(z, 0.5);
        this.image = images.MC;
        this.accel = .5;
        this.friction = .7;
        this._velCap = 3;
        this.rect.width = Math.floor(this.image.width/1.5);
        this.rect.height = Math.floor(this.image.height/2);
    }
    
    MainChar.prototype = new Entity.Entity();
    MainChar.prototype.constructor = MainChar;
    
    MainChar.prototype.update = function(input, map)
    {
        if (input[0] + input[1] + input[2] + input[3])
        {
            if (input[0]) // up
            {   
                this.velocity.y -= this.accel;
            }
            if (input[1]) // right
            {
                this.velocity.x += this.accel;
            }
            if (input[2]) //down
            {
                this.velocity.y += this.accel;
            }
            if (input[3]) // left
            {
                this.velocity.x -= this.accel;
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
        this.move(map);
    }
    
    MainChar.prototype.drawImage = function(ctx, offset)
    {
        ctx.drawImage(
            images.MC,                                                  //image
            0,                                                          //x position on image
            0,                                                          //y position on image
            images.MC.width,                                            //imageWidth on Source
            images.MC.height,                                           //imageHeight on Source
            this.rect.position.x + offset.x - 6,                        //xPosCanvas    
            this.rect.position.y + offset.y - this.image.height/2,      //yPosCanvas    
            images.MC.width,                                            //imageWidth on Canvas
            images.MC.height                                            //imageHeight on Canvas                
        )
        this.rect.draw(ctx, offset, "#FF00FF");
    }
    
    MainChar.prototype.move = function(map)
    {
        // I imagine apply tileEffect would be around here
        var dx = this.velocity.x;
        var dy = this.velocity.y;
        var walls = map.walls;
        var wallLength = walls.length;
        var td = vars.tileDimension;
        
        this.rect.position.x += dx;
        
        for (var i = 0; i < wallLength; i++)
        {
            if (this.rect.collideRect(walls[i]))
            {
                if (dx > 0) // moving right, hit left side of wall
                {
                    this.rect.setRight(walls[i].getLeft()-1);
                }
                else if (dx < 0) // moving left, hit right side of wall
                {
                    this.rect.setLeft(walls[i].getRight()+1);
                }
            }
        }
        
        this.rect.position.y += dy;

        for (var i = 0; i < wallLength; i++)
        {
            if (this.rect.collideRect(walls[i]))
            {
                if (dy > 0) // moving down, hit top side of wall
                {
                    this.rect.setBottom(walls[i].getTop()-1);
                }
                else if (dy < 0) // moving up, hit bottom side of wall
                {
                    this.rect.setTop(walls[i].getBottom()+1);
                }
            }
        }
    }
    
    return {
        MainChar: MainChar
    };
});