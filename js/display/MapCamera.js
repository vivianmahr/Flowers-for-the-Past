define(["util/Point", "util/goody", "assets/vars"],
function(Point, goody, vars)
{    
    function MapCamera(ctx) {
        this._offset = new Point.Point(0, 0); 
        this._buffer = [];
        this._ctx = ctx;
        this._mapPixelWidth = 0;
        this._mapPixelHeight = 0;
        this._mapLength = 0;
    }

    MapCamera.prototype.loadMap = function(map) {
        // Loads the buffer images for a map
        this._buffer = [];
        this._mapPixelWidth = map.pixelWidth;
        this._mapPixelHeight = map.pixelHeight;
        this._mapLength = map.length;
        var bufferLength = map.displayedLayers;
        for (var i=0; i<bufferLength; i++) {
            this._buffer.push(document.createElement("canvas"));
            this._buffer[i].width = this._mapPixelWidth;
            this._buffer[i].height = this._mapPixelHeight;
            var ctx = this._buffer[i].getContext("2d");
            var layer = map.imageMap[i];
            for (var n=0; n<this._mapLength; n++) {
                this.renderTile(images.BaseTiles, n, layer[n], map, ctx);
            }
        }
        this._ctx.font = "20px sans-serif";
        this._ctx.fillStyle = "#FF0000";
    }
    
    MapCamera.prototype._calcOffset = function(MC) {
        // Calculates the displacement of the map 
        var cwidth = vars.displayWidth;
        var cheight = vars.displayHeight;
        var MCpos = MC.rect.position;
        this._offset.x = goody.cap(cwidth/2-MCpos.x, -this._mapPixelWidth+cwidth, 0);
        this._offset.y = goody.cap(cheight/2-MCpos.y, -this._mapPixelHeight+cheight, 0);
    };

    MapCamera.prototype.showString = function(string) {
        // Displays a string on the upper left corner of the canvas
        this._ctx.fillText(string, 10, 20);
    }

    MapCamera.prototype.display = function(MC, cursor, entites) {
        // Displays the map, MainChar, cursor, and any additional Entity objects
        this._calcOffset(MC);
        var bufferLength = this._buffer.length;
        var MCdrawn = false;
        for (var i=0; i<bufferLength; i++) {
            this._ctx.drawImage(this._buffer[i], this._offset.x, this._offset.y);
            if (i===MC.movementAttributes.height+1+MC.movementAttributes.airborne ? 1 : 0) {
                MC.drawImage(this._ctx, this._offset);
                MCdrawn = true;
            }
        }
        if (!MCdrawn) {
            MC.drawImage(this._ctx, offset);
        }
        cursor.display(this._ctx);
        // Display debugging information - whatever is necessary at the moment 
        var scrap = MC.movementAttributes;
        this.showString("height=" + scrap.height + " air=" + scrap.airborne + " sink=" + scrap.sinking);
    }
    
    MapCamera.prototype.renderTile = function(image, i, tile, map, ctx)
    {    
        //NOTE - is this one cause of the incrememntation now?
        if ( tile === 0 ) { return; }                                   //default blank tile in tiled
        var dim = vars.tileDimension;
        var mapPoint = map.tileToPixel(i);
        var tilePos = tile-1-vars.propertiesOffset;                    // tile position in the tilesheet
        var xpos = (tilePos%(image.width/24)-1)*dim;                   //calc off tilePos
        var ypos = Math.floor(tilePos/(image.width/24)-1)*dim;         //calc off tilePos
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
    
    return {
        MapCamera:MapCamera
    };
});