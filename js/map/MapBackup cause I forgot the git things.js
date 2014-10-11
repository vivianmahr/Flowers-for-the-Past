define(["util/goody", "util/Point", "assets/vars", "util/Rect", "map/Tile"],
function(goody, Point, vars, Rect, Tile)
{    
    function Map(json)
    {
        this.height = json.height;
        this.width = json.width;
        this.pixelWidth = this.width * vars.tileDimension;
        this.pixelHeight = this.height * vars.tileDimension;
        // this.walls = [];
        this.length = json.layers[0].data.length;
        // convert to tiles option 
        // nope that broke it so sadly

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
    
    Map.prototype.oneTileUp = function(n) { return n + this.width; };
    Map.prototype.oneTileDown = function(n) { return n - this.width; };
    Map.prototype.pixelPoint = function(tileNumber) { return new Point.Point(tileNumber%this.width * vars.tileDimension, Math.floor(tileNumber/this.width) * vars.tileDimension); };
    
    Map.prototype.generateTiles = function(layers)
    {
        var dataLength = layers[0].data.length;
        var layers = [];
        for (var y = 0; y < dataLength; y+=this.width*2)
        {
            for (var x = 0; x < this.width; x+=2)
            {
                var i = x + y;
                // layers.push(new Tile.Tile(
                    // x * vars.dimension,
                    // y * vars.dimension
                // ));
            }
            // layers.push(new Tile.Tile(
                // i%this.width * vars.tileDimension,                 // x
                // Math.floor(i/this.width) * vars.tileDimension,     // y
                // {[0,0,0], 0, 0},            //BG   - 2 numbers
                // {[0,0,0], 0, 0},            //EF   - 2 numbers
                // {[0,0,0], 0},               //DECO - 1 number
            // ));
        }
        return layers;
    }
    
    Map.prototype.generateWalls = function(data)
    {
        var index = [];
        while (!goody.allSame(data)) 
        {
            for (var i = 0; i < data.length; i++)
            {
                if (data[i] !== 0)
                {
                    index.push(i);
                    data[i] = 0;
                    data[i+1] = 0;
                    data[i+this.width] = 0;
                    data[i+this.width+1] = 0;
                }
            }
        }

        var walls = [];
        while (index.length !== 0)
        {
            walls.push(this.rectFromIndex(index.pop()));   
        }
        var mergedWalls = true;
        
        while (mergedWalls)
        {
            var wallLength = walls.length;
            var i = 0;
            var n = 0;
            mergedWalls = false;
            for (i = 0; i < wallLength; i++)
            {
                for (n = 0; n < wallLength; n++)
                {
                    if (i == n) { continue; }
                    if (walls[i].mergeable(walls[n]))
                    {
                        mergedWalls = true;
                        break;
                    }
                }
                if (mergedWalls) { break; }
            }
            if (mergedWalls)
            { 
                var merge = walls[n].merge(walls[i]);
                walls.splice(n, 1);
                walls.splice(i, 1);
                walls.push(merge);
            }
        }
        this.walls = walls;
    };
    
    // Map.prototype.rectFromIndex = function(index)
    // {
    //     var location = this.pixelPoint(index);
    //     return new Rect.Rect(location.x, location.y, vars.tileDimension * 2, vars.tileDimension * 2);
    // };
    
    // Map.prototype.collidesWall = function(rect)
    // {
        
    // };
    
    return {
        Map: Map
    };
});