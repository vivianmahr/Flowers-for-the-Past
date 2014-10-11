define(["util/Point", "util/goody", "assets/images", "assets/vars"],
function(Point, goody, images, vars)
{    
    function Camera()
    {
        this.offset = new Point.Point(0, 0); 
        this.mapBase = images._000;
        this.buffer = [];
    }
    
    Camera.prototype.loadMap = function(map)
    {
        this.buffer = [];
        var bufferLength = map.displayLayers;
        var w = map.pixelWidth;
        var h = map.pixelHeight;
        var ml = map.length;
        for (var i=0; i<bufferLength; i++)
        {
            this.buffer.push(document.createElement("canvas"));
            this.buffer[i].width = w;
            this.buffer[i].height = h;
            var ctx = this.buffer[i].getContext("2d");
            var layer = map.layers[i];
            for (var n = 0; n < ml; n++)
            {
                this.renderTile(images._000, n, layer[n], map, ctx);
            }
        }
    };
    
    Camera.prototype.display = function(canvas, ctx, map, MC, cursor, entities)
    {
        this._calcOffset(canvas, MC, map);
        var bufferLength = this.buffer.length;
        for (var i=0; i < bufferLength; i++)
        {
            ctx.drawImage(this.buffer[i], this.offset.x, this.offset.y);
            if ((i+0.5) == MC.z)
            {
                MC.drawImage(ctx, this.offset);
                MC.rect.draw(ctx, this.offset, "#FF00FF");
            }
        }
        ctx.drawImage(
            images.cursor,                                   
            cursor.offset.x,                                        
            0,                                                   
            5,                                                 
            5,                                               
            cursor.position.x,                              
            cursor.position.y,                                        
            8,                                                         
            8                                                                       
        );
        //for (var n = 0; n < map.walls.length; n++){ map.walls[n].draw(ctx, this.offset);}
    };
    
    Camera.prototype.renderTile = function(image, i, tile, map, ctx)
    {    
        if ( tile === 0 || tile==1 ) { return; }
        var dim = vars.tileDimension;
        var mapPoint = map.pixelPoint(i);
        var tilePos = tile-1-vars.propertiesOffset; // tile position in the tilesheet
        var xpos = (tilePos%12) * dim;              //calc off tilePos
        var ypos = Math.floor(tilePos/12) * dim;    //calc off tilePos
        if (image == images._debug)
        {
            xpos = 24;
            ypos = 24;
        }
        ctx.drawImage(
            image,                                                      //image
            xpos,                                                       //x position on image
            ypos,                                                       //y position on image
            dim,                                                        //imageWidth on Source
            dim,                                                        //imageHeight on Source
            mapPoint.x,                                                 //xPosCanvas    
            mapPoint.y,                                                 //yPosCanvas    
            dim,                                                        //imageWidth on Canvas
            dim                                                         //imageHeight on Canvas                
        );
    };
    
    Camera.prototype._calcOffset = function(canvas, MC, map)
    {
        var cwidth = canvas.width;
        var cheight = canvas.height;
        var MCpos = MC.rect.position;
        this.offset.x = goody.cap(cwidth/2 - MCpos.x, -map.pixelWidth + cwidth, 0);
        this.offset.y = goody.cap(cheight/2 - MCpos.y, -map.pixelHeight + cheight, 0);
    };
    
    return {
        Camera:Camera
    };
});