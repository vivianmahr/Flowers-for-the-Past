define(["physics/Vector", "lib/goody", "assets/vars"],
function(Vector, goody, vars)
{    
    function MapCamera(ctx) {
        this._offset = new Vector.Vector(0, 0); 
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
        var bufferLength = map.displayedLayers * 2;
        var offset = 0;
        if (map.parallax) {
            for (var i = 0; i < 2; i++) {
                var i = this._buffer.length;
                this._buffer.push(document.createElement("canvas"));
                this._buffer[i].width = this._mapPixelWidth;
                this._buffer[i].height = this._mapPixelHeight;
                var ctx = this._buffer[i].getContext("2d");
                var image = images["intro_P" + i];
                ctx.drawImage(
                    image,                                                      //image
                    0,                                                       //x position on image
                    0,                                                       //y position on image
                    image.width,                                                        //imageWidth on Source
                    image.height,                                                        //imageHeight on Source
                    0,                                                //xPosCanvas    
                    0,                                                 //yPosCanvas    
                    image.width,                                                        //imageWidth on Canvas
                    image.height                                                         //imageHeight on Canvas                
                );
            }
        }
        for (var i = 0; i < bufferLength; i += 2) {
            this.renderLayer(map.imageMap[Math.floor(i/2)], map, images.Tileset);
            this.renderLayer(map.effectMap[Math.floor(i/2)], map, images.Tileset);
        }
        this._ctx.font = "20px sans-serif";
        this._ctx.fillStyle = "#FF0000";
    }

    MapCamera.prototype.reloadMap = function(map) {
        var bufferLength = this._buffer.length;
        for (var i = (map.parallax ? 2 : 0); i < bufferLength; i += 2) {
            var layerNumber = Math.floor(i/2) + (map.parallax ? 2 : 1);
            var layer = map.effectMap[i/2 - (map.parallax ? 1 : 0)];
            var ctx = this._buffer[layerNumber].getContext("2d");
            ctx.clearRect (0, 0, vars.displayHeight, vars.displayWidth);
            for (var n = 0; n < this._mapLength; n++) {
                this.renderTile(n, layer[n], map, ctx);
            }
        }
    }

    MapCamera.prototype.renderLayer = function(layer, map, image) {
        var i = this._buffer.length;
        this._buffer.push(document.createElement("canvas"));
        this._buffer[i].width = this._mapPixelWidth;
        this._buffer[i].height = this._mapPixelHeight;
        var ctx = this._buffer[i].getContext("2d");
        for (var n = 0; n < this._mapLength; n++) {
            this.renderTile(n, layer[n], map, ctx);
        }
    }
    
    MapCamera.prototype._calcOffset = function(MC) {
        // Calculates the displacement of the map 
        var cwidth = vars.displayWidth;
        var cheight = vars.displayHeight;
        var MCpos = MC.rect.position;
        this._offset.x = Math.floor(goody.cap(cwidth / 2 - MCpos.x, -this._mapPixelWidth + cwidth, 0));
        this._offset.y = Math.floor(goody.cap(cheight /2 - MCpos.y, -this._mapPixelHeight + cheight, 0));
    };

    MapCamera.prototype.showString = function(string) {
        // Displays a string on the upper left corner of the canvas
        this._ctx.fillText(string, 10, 20);
    }

    MapCamera.prototype.display = function(MC, cursor, objects) {
        // Displays the map, MainChar, cursor, and any additional Entity objects
        this._calcOffset(MC);
        var bufferLength = this._buffer.length;
        var MCdrawn = false;
        for (var i = 0; i < bufferLength; i++) {
            this._ctx.drawImage(this._buffer[i], this._offset.x, this._offset.y);
            if (Math.floor(i / 2) === MC.movementAttributes.height + 1 + MC.movementAttributes.airborne ? 1 : 0) {
                MC.drawImage(this._ctx, this._offset);
                MCdrawn = true;
            }
        }
        if (!MCdrawn) {
            MC.drawImage(this._ctx, this._offset);
        }
        cursor.display(this._ctx);
        // Display debugging information - whatever is necessary at the moment 
        var scrap = MC.movementAttributes;
        //this.showString(scrap.height);
        // this.showString("t= " + scrap.temperature + "height=" + scrap.height + " air=" + scrap.airborne + " sink=" + scrap.sinking);
    }

    MapCamera.prototype.absolutePosition = function(canvasPosition) {
        return new Vector.Vector(canvasPosition.x - this._offset.x, canvasPosition.y - this._offset.y);
    }
    
    MapCamera.prototype.renderTile = function(i, tile, map, ctx) {    
        // Most likely a lot of this has to change once I get the main tileset...
        if ( tile === 1 ) { return; }
        
        var image;
        if (tile <= 2377) {
            image = images.Tileset;
        }
        else {
            image = images.Tileset; // switch to other images
        } 

        var dim = vars.tileDimension;
        var mapVector = map.tileToPixel(i);
        var xpos = (tile % (image.width / dim) - 1) * dim;            
        var ypos = Math.floor(tile / (image.width / dim)) * dim; 
        
        ctx.drawImage(
            image,                                                      //image
            xpos,                                                       //x position on image
            ypos,                                                       //y position on image
            dim,                                                        //imageWidth on Source
            dim,                                                        //imageHeight on Source
            mapVector.x,                                                //xPosCanvas    
            mapVector.y,                                                 //yPosCanvas    
            dim,                                                        //imageWidth on Canvas
            dim                                                         //imageHeight on Canvas                
        );
    };
    
    return {
        MapCamera:MapCamera
    };
});