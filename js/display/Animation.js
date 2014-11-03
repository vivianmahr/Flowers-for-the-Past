define(["util/Point", "util/goody", "assets/vars"],
function(Point, goody, vars)
{    
    function Animation(image, frames, width, height)
    {
        this.width = width;
        this.height = height;
        this._maxFrames = frames;
        this._frame = 0;
        this._image = image;
        this._imageOffset = new Point.Point(0, 0);
    }

    Animation.prototype.orient = function(direction) {
        // Mainly used for rotating sprites at the moment
        this._imageOffset.y = this.height * vars.directions[direction];
    }
    
    Animation.prototype.update = function() {
        // Changes to the next frame and loops if needed
        this._frame++;
        if (this._frame === this._maxFrames) {
            this._frame = 0;
        }
        this._imageOffset.x = this._frame * this.width;
    }
    
    Animation.prototype.display = function(ctx, offset){
        // Draws the current sprite
        ctx.drawImage(   
            this._image,                                                      //image
            this._imageOffset.x,                                              //x position on image
            this._imageOffset.y,                                              //y position on image
            this.width,                                                 //imageWidth on Source
            this.height,                                                //imageHeight on Source
            offset.x,                                                   //xPosCanvas    
            offset.y,                                                   //yPosCanvas, integer offsets are for centering  
            this.width,                                                 //imageWidth on Canvas
            this.height                                                 //imageHeight on Canvas                
        )
    }

    return {
        Animation:Animation
    };
});