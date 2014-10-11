define(["util/goody", "util/Point", "assets/vars", "util/Rect", "map/Tile"],
function(goody, Point, vars, Rect, Tile)
{    
    function Map(json)
    {
        this.height = json.height;
        this.width = json.width;
        this.pixelWidth = this.width * vars.tileDimension;
        this.pixelHeight = this.height * vars.tileDimension;
        this.length = json.layers[0].data.length;
        this.displayedLayers = 3;
        // convert to tiles option 
        // nope that broke it so sadly
        this.heightMap = [];
        this.imageMap = [];
        this.objects = [];
        // Okay. 3 maps, one for each of the variables
        // height map
        // 3 layer image map
        // objects + MC
        // for now, render depening on the layer thing
        // Everything in objects renders by height1
        // this.layers = [];
        // var layers = json.layers;
        // for (var i = 0; i < layers.length; i++)
        // {
        //     if (layers[i].name != "Collide")
        //     {
        //         this.layers.push(layers[i].data);
        //     }
        //     else
        //     {
        //        this.generateWalls(layers[i].data);
        //     }
        // }
    }

    Map.prototype.indexUp = function(n) { return n + this.width; };
    Map.prototype.indexDown = function(n) { return n - this.width; };
    Map.prototype.indexRight = function(n) { return n + 1; };
    Map.prototype.indexLeft = function(n) { return n - 1; };

    Map.prototype.findRow = function(tileNumber){
        return Math.trunc(tileNumber / this.width);
    }
    Map.prototype.findColumn = function(tileNumber) {
        return tileNumber % this.width; 
    }

    Map.prototype.findTilebyIndex = function(tile) {
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


    Map.prototype.findTilebyPixel = function(pixelPoint) {
        return findTilebyIndex(convertpixelpoint());
    }

    // Map.prototype.pixelPoint = function(tileNumber) { return new Point.Point(tileNumber%this.width * vars.tileDimension, Math.floor(tileNumber/this.width) * vars.tileDimension); };
        
    return {
        Map: Map
    };
});