define(["util/goody", "util/Point", "assets/vars", "util/Rect"],
function(goody, Point, vars, Rect)
{    
    function Map(json)
    {
        this.height = json.height;
        this.width = json.width;
        this.pixelWidth = this.width * vars.tileDimension;
        this.pixelHeight = this.height * vars.tileDimension;
        this.length = json.layers[0].data.length;
        this.displayedLayers = 3;   // for now, unsure, but there are 3 BG layers

        // Height of each tile - used for display and collision
        this.heightMap = [];
        // Maps of the current elements
        this.elementMap = {};
        // Layers of the map, used for display
        this.imageMap = [];
        // Objects
        this.objects = [];

        var layers = json.layers;
        for (var i = 0; i < layers.length; i++)
        {
            var name = layers[i].name;
            if (goody.stringContains(name, "BG")) {
                this.imageMap.push(layers[i].data);
            }
            else if (name == "height") {
                this.heightMap = layers[i].data;
            }
            else if (name == "Objects") {
                this.objects = layers[i].data;
            }
            else {
                this.elementMap[name] = layers[i].data;
            }
        }
    }

    Map.prototype.indexUp = function(n) { return n + this.width; };
    Map.prototype.indexDown = function(n) { return n - this.width; };
    Map.prototype.indexRight = function(n) { return n + 1; };
    Map.prototype.indexLeft = function(n) { return n - 1; };

    Map.prototype.findRow = function(tileNumber){
        return Math.floor(tileNumber / this.width);
    }
    Map.prototype.findColumn = function(tileNumber) {
        return tileNumber % this.width; 
    }

    Map.prototype.findZonebyIndex = function(tile) {
        // return order [upperLeft, upperRight, lowerLeft, lowerRight];
        var evenRow = this.findRow(tile) % 2 == 0;
        var evenColumn = this.findColumn(tile)% 2 == 0;
        if (evenRow && evenColumn) { // tile index passed in is on the upper left
            return [tile, this.indexRight(tile), this.indexDown(tile),  this.indexDown(this.indexRight(tile))];
        }
        else if (evenRow) { // tile index passed in is on the upper right
            return [this.indexLeft(tile), tile, this.indexDown(this.indexLeft(tile)), this.indexDown(tile)];
        }
        else if (evenColumn) { // tile index passed in is on the lower left
            return [this.indexUp(tile), this.indexUp(this.indexRight(tile)), tile, this.indexRight(tile)];
        }
        else { // tile index passed in is on the lower right
            return [this.indexUp(this.indexLeft(tile)), this.indexUp(tile), this.indexLeft(tile), tile];
        }
    }

    // Map.prototype.findZonebyPixel = function(pixelPoint) {
    //     return this.findTilebyIndex(this.tileToPixel(pixelPoint));
    // }

    Map.prototype.getHeight = function(tileIndex) {
        return this.heightMap[tileIndex];
    }

    Map.prototype.pixelToTile = function(point) {
        var column =  Math.floor(point.x/vars.tileDimension);
        var row = Math.floor(point.y/vars.tileDimension);
        return row * this.width + column;
    }
    
    Map.prototype.tileToPixel = function(tileNumber) { 
        return new Point.Point(tileNumber%this.width * vars.tileDimension, Math.floor(tileNumber/this.width) * vars.tileDimension); 
    };
        
    return {
        Map: Map
    };
});