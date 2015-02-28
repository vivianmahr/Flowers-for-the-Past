define(["lib/goody", "physics/Vector", "assets/vars"],
function(goody, Vector, vars)
{    
    function Map(json) {
        this.height = json.height;
        this.width = json.width;
        this.pixelWidth = this.width * vars.tileDimension;
        this.pixelHeight = this.height * vars.tileDimension;
        this.length = json.layers[0].data.length;
        this.displayedLayers = 3;   // for now, unsure, but there are 3 BG layers
        this.parallax = false;

        // Height of each tile - used for display and collision
        this.heightMap = [];
        // Maps of the current elements
        this.elementMap = {};
        // Layers of the map, used for display
        this.imageMap = [];
        this.effectMap = [];
        this.parallaxMap = [];
        // Objects, not really used atm
        this.objects = [];
        this.eventMap = [];

        var layers = json.layers;
        for (var i = 0; i < layers.length; i++) {
            var name = layers[i].name;
            // Tile layer that's rendered
            if (goody.stringContains(name, "EF")) {
                this.effectMap.push(layers[i].data);
            }
            else if (goody.stringContains(name, "BG")) {
                this.imageMap.push(layers[i].data);
            }
            else if (goody.stringContains(name, "P")) {
                this.parallaxMap.push(layers[i].data);
                this.parallax = true;
            }
            // Height map
            else if (name === "Height") {
                this.heightMap = layers[i].data.map( function(x) {return x-1; });
            }
            // Unused atm
            else if (name === "Objects") {
                this.objects = layers[i].objects;
            }
            // Tiles that can only be traversed while airborne / sinking
            else if (name === "JumpFlag") {
                this.jumpMap = layers[i].data;
            }
            // Events
            else if (name === "Events") {
                this.eventMap = layers[i].objects;
            }
            // Element maps
            else {
                this.elementMap[name] = layers[i].data.map( function(x) { return x-1; } );
            }
        }
    }

    Map.prototype.indexUp = function(n) { return n - this.width; };
    Map.prototype.indexDown = function(n) { return n + this.width; };
    Map.prototype.indexRight = function(n) { return n + 1; };
    Map.prototype.indexLeft = function(n) { return n - 1; };

    Map.prototype.findRow = function(tileNumber) {
        return Math.floor(tileNumber / this.width);
    }
    Map.prototype.findColumn = function(tileNumber) {
        return tileNumber % this.width; 
    }

    Map.prototype.isJump = function(tileIndex) {
        // Does the tile number have the jumpFlag?
        return this.jumpMap[tileIndex] !== 0;
    }

    Map.prototype.findZonebyIndex = function(tile) {
        // return order [upperLeft, upperRight, lowerLeft, lowerRight];
        var evenRow = this.findRow(tile) % 2 == 0;
        var evenColumn = this.findColumn(tile)% 2 == 0;
        // tile index passed in is on the upper left
        if (evenRow && evenColumn) { 
            return [tile, this.indexRight(tile), this.indexDown(tile),  this.indexDown(this.indexRight(tile))];
        }
        // tile index passed in is on the upper right
        else if (evenRow) { 
            return [this.indexLeft(tile), tile, this.indexDown(this.indexLeft(tile)), this.indexDown(tile)];
        }
        // tile index passed in is on the lower left
        else if (evenColumn) { 
            return [this.indexUp(tile), this.indexUp(this.indexRight(tile)), tile, this.indexRight(tile)];
        }
        // tile index passed in is on the lower right
        else { 
            return [this.indexUp(this.indexLeft(tile)), this.indexUp(tile), this.indexLeft(tile), tile];
        }
    }

    Map.prototype.applyElement = function(pixelVector, element) {
        var zone = this.findZonebyPixel(pixelVector);
        var elementType = element < 2 ? "Humidity" : element < 4 ? "Growth" : "Temperature";
        var increment = element % 2 ? 1 : -1;
        var cap = increment == 1 ? 2 : 0;
        // For early stages only
        var negate = ["Humidity", "Growth", "Temperature"];
        negate.splice(negate.indexOf(elementType), 1);

        for (var i = 0; i < 4; i++) {
            var tile = zone[i];
            this.elementMap[elementType][tile] = this.elementMap[elementType][tile] + increment;
            // Temp...maybe.
            this.elementMap[negate[0]][tile] = 0;
            this.elementMap[negate[1]][tile] = 0;
        }
        if (elementType == "Growth") {
            // Add objects
        }
        this.updateZone(zone, element, this.elementMap[elementType][zone[1]]);
    }
    
    Map.prototype.updateZone = function(zone, appliedElement, currentElement) {
        var newEF0 = [0, 0, 0, 0];
        var newEF1 = [0, 0, 0, 0];
        var newEF2 = [0, 0, 0, 0];
        if (currentElement !== 1) {
            switch(appliedElement) {
                case 0: // Dry
                    break;
                case 1: // Wet
                    break;
                case 2: // Rot
                    break;
                case 3: // Life
                    break;
                case 4: // Cold
                    break;
                case 5: // Hot
                    newEF0 = [359, 360, 575, 576];
                    break;
            }
        }
        for (var i = 0; i < 4; i++) {
            var tile = zone[i];
            this.effectMap[0][tile] = newEF0[i];
            this.effectMap[1][tile] = newEF1[i];
            this.effectMap[2][tile] = newEF2[i];
        }
    }

    Map.prototype.findZonebyPixel = function(pixelVector) {
        return this.findZonebyIndex(this.pixelToTile(pixelVector));
    }

    Map.prototype.getHeight = function(tileIndex) {
        return this.heightMap[tileIndex];
    }

    Map.prototype.getElement = function(tileIndex, element) {
        return this.elementMap[element][tileIndex];
    }

    Map.prototype.pixelToTile = function(point) {
        var column =  Math.floor(point.x/vars.tileDimension);
        var row = Math.floor(point.y/vars.tileDimension);
        return row * this.width + column;
    }
    
    Map.prototype.tileToPixel = function(tileNumber) { 
        return new Vector.Vector(tileNumber%this.width * vars.tileDimension, Math.floor(tileNumber/this.width) * vars.tileDimension); 
    };
        
    return {
        Map: Map
    };
});