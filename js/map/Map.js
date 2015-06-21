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
                this.heightMap = layers[i].data;
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


    // Generally helpful "get to adjacent tile/zone" functions
    Map.prototype.indexUp = function(n) { return n - this.width; };
    Map.prototype.indexDown = function(n) { return n + this.width; };
    Map.prototype.indexRight = function(n) { return n + 1; };
    Map.prototype.indexLeft = function(n) { return n - 1; };
    Map.prototype.indexUpRight = function(n) {return n - this.width + 1; };
    Map.prototype.indexUpLeft = function(n) {return n - this.width - 1; };
    Map.prototype.indexDownRight = function(n) {return n + this.width + 1; };
    Map.prototype.indexDownLeft = function(n) {return n + this.width - 1; };

    Map.prototype.zoneIndexUp = function(zone) { return this.findZonebyIndex(this.indexLeft(zone.upLeft)); };
    Map.prototype.zoneIndexDown = function(zone) { return this.findZonebyIndex(this.indexDown(zone.downRight)); };
    Map.prototype.zoneIndexRight = function(zone) { return this.findZonebyIndex(this.indexRight(zone.downRight)); };
    Map.prototype.zoneIndexLeft = function(zone) { return this.findZonebyIndex(this.indexLeft(zone.downLeft)); };
    Map.prototype.zoneIndexUpRight = function(zone) {return this.findZonebyIndex(this.indexUpRight(zone.upRight)); };
    Map.prototype.zoneIndexUpLeft = function(zone) {return this.findZonebyIndex(this.indexUpLeft(zone.upLeft)); };
    Map.prototype.zoneIndexDownRight = function(zone) {return this.findZonebyIndex(this.indexDownRight(zone.downRight)); };
    Map.prototype.zoneIndexDownLeft = function(zone) {return this.findZonebyIndex(this.indexDownLeft(zone.downLeft)); };

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
        // return order [upLeft, upRight, downLeft, downRight];
        var evenRow = this.findRow(tile) % 2 == 0;
        var evenColumn = this.findColumn(tile)% 2 == 0;
        // tile index passed in is on the up left
        if (evenRow && evenColumn) { 
            return {
                "upLeft" : tile,
                "upRight": this.indexRight(tile),
                "downLeft" : this.indexDown(tile),
                "downRight" : this.indexDownRight(tile) 
            }
        }
        // tile index passed in is on the up right
        else if (evenRow) { 
            return {
                "upLeft" : this.indexLeft(tile),
                "upRight": tile,
                "downLeft" : this.indexDownLeft(tile),
                "downRight" : this.indexDown(tile) 
            }
        }
        // tile index passed in is on the down left
        else if (evenColumn) { 
            return {
                "upLeft" : this.indexUp(tile),
                "upRight": this.indexUpRight(tile),
                "downLeft" : tile,
                "downRight" : this.indexRight(tile) 
            }

        }
        // tile index passed in is on the down right
        else { 
            return {
                "upLeft" : this.indexUpLeft(tile),
                "upRight": this.indexUp(tile),
                "downLeft" : this.indexLeft(tile),
                "downRight" : tile 
            }
        }
    }

    Map.prototype.getZoneElement = function(zone) {
        return this.getTileElement(zone.upLeft);
    }

    Map.prototype.applyElement = function(pixelVector, element) {
        var zone = this.findZonebyPixel(pixelVector);
        var elementType = element < 2 ? "Humidity" : element < 4 ? "Growth" : "Temperature";
        var tiles = ["upRight", "upLeft", "downLeft", "downRight"];
        var increment = element % 2 ? 1 : -1; // Whether the category changes by + or - 1
        var cap = increment === 1 ? 2 : 0;
        // For early stages only, tiles should only have one element applied to them at a time
        var negate = ["Humidity", "Growth", "Temperature"];
        negate.splice(negate.indexOf(elementType), 1);
        for (var i = 0; i < 4; i++) {
            var tile = zone[tiles[i]];
            this.elementMap[elementType][tile] = goody.cap(this.elementMap[elementType][tile] + increment, 0, 2);
            // Temp...maybe.
            this.elementMap[negate[0]][tile] = 1;
            this.elementMap[negate[1]][tile] = 1;
        }
        if (elementType == "Growth") {
            // Add objects
        }
        this.updateZone(zone, false);
    }
    
    Map.prototype.updateZone = function(zone, isNeighbor) {
        var newEF0 = [0, 0, 0, 0];
        var newEF1 = [0, 0, 0, 0];
        var newEF2 = [0, 0, 0, 0];
        var BG0Images = [0, 0, 0, 0];
        var tiles = ["upRight", "upLeft", "downLeft", "downRight"];
        for (var i = 0; i < 4; i++) {
            var tile = zone[tiles[i]];
            newEF0[i] = this.effectMap[0][tile];
            newEF1[i] = this.effectMap[1][tile];
            newEF2[i] = this.effectMap[2][tile];
            BG0Images[i] = this.imageMap[0][tile];
        }
        var tileElement = this.getZoneElement(zone);
        if (goody.arrayEquals(tileElement, [1, 1, 1])) { // pure neutral, dirt
            newEF0 = [0, 0, 0, 0]; // Invisible
        }
        else {
            var adjacentTilesDifferentElement = this.compareAdjacentTiles(tileElement, zone);  
            var elementType;
            var increment;
            // May or may not be refactored, need more testing - multiple elements allowed?
            if (tileElement[0] !== 1) {
                elementType = "Growth";
                increment = tileElement[0];
            }
            else if (tileElement[1] !== 1) {
                elementType = "Humidity";
                increment = tileElement[1];
            }
            else {
                elementType = "Temperature";
                increment = tileElement[2];
            }
            //.. If I understand right this only works if it started edgeless?
            console.log(newEF0);
            newEF0 = BG0Images.map( function(x) { return x + ((increment-1) * vars.elementalTileOffsets[elementType]); } );
            console.log(newEF0);
        
            if (adjacentTilesDifferentElement["up"]) {
                newEF0[0] -= vars.tileSetTileWidth;
                newEF0[1] -= vars.tileSetTileWidth;
            }
            else if (!isNeighbor) {
                this.updateZone(this.zoneIndexUp(zone), true)
            }


            if (adjacentTilesDifferentElement["right"]) { // right is different
                newEF0[1] += 1;
                newEF0[3] += 1;
            }
            else if (!isNeighbor){
                this.updateZone(this.zoneIndexRight(zone), true)
            }

            if (adjacentTilesDifferentElement["down"]) { // down is different
                newEF0[2] += vars.tileSetTileWidth;
                newEF0[3] += vars.tileSetTileWidth;
            }
            else if (!isNeighbor){
                this.updateZone(this.zoneIndexDown(zone), true)
            }


            if (adjacentTilesDifferentElement["left"]) { // left is different
                newEF0[0] -= 1;
                newEF0[2] -= 1;
            }
            else if (!isNeighbor){
                this.updateZone(this.zoneIndexLeft(zone), true);
            }
/*
            // upright
            if (!adjacentTilesDifferentElement[0] && !adjacentTilesDifferentElement[2] && adjacentTilesDifferentElement[1]) {
                newEF0[1] = newEF0[1] + vars.tileSetTileWidth * 3 -1;
            }
            else {
                this.updateNeighboringTile(this.findZonebyIndex(this.indexRight(this.indexUp(zone[1]))));
            }

            // downleft
            if (!adjacentTilesDifferentElement[4] && !adjacentTilesDifferentElement[6] && adjacentTilesDifferentElement[5]) {
                newEF0[2] = newEF0[2] + vars.tileSetTileWidth * 3 -1;
            }
            else {
                this.updateNeighboringTile(this.findZonebyIndex(this.indexLeft(this.indexDown(zone[2]))));
            }
            */
        }
        console.log(newEF0);
        for (var i = 0; i < 4; i++) {
            var tile = zone[tiles[i]];
            this.effectMap[0][tile] = newEF0[i];
            this.effectMap[1][tile] = newEF1[i];
            this.effectMap[2][tile] = newEF2[i];
        }
    }


    Map.prototype.compareAdjacentTiles = function(tileElement, zone) {
        return {
            "up" : !goody.arrayEquals(this.getTileElement(this.zoneIndexUp(zone)), tileElement), 
            "upRight": !goody.arrayEquals(this.getTileElement(this.zoneIndexUpRight(zone)), tileElement), 
            "right" : !goody.arrayEquals(this.getTileElement(this.zoneIndexRight(zone)), tileElement), 
            "downRight" : !goody.arrayEquals(this.getTileElement(this.zoneIndexDownRight(zone)), tileElement), 
            "down" : !goody.arrayEquals(this.getTileElement(this.zoneIndexDown(zone)), tileElement), 
            "downLeft" : !goody.arrayEquals(this.getTileElement(this.zoneIndexDownLeft(zone)), tileElement), 
            "left" : !goody.arrayEquals(this.getTileElement(this.zoneIndexLeft(zone)), tileElement), 
            "upLeft" : !goody.arrayEquals(this.getTileElement(this.zoneIndexUpLeft(zone)), tileElement),    
        }
    }


    Map.prototype.findZonebyPixel = function(pixelVector) {
        return this.findZonebyIndex(this.pixelToTile(pixelVector));
    }

    Map.prototype.getHeight = function(tileIndex) {
        return this.heightMap[tileIndex];
    }
    Map.prototype.getTileElement = function(tileIndex) {
        var result  = [];
        result.push(this.elementMap["Growth"][tileIndex]);
        result.push(this.elementMap["Humidity"][tileIndex]);
        result.push(this.elementMap["Temperature"][tileIndex]);
        return result;
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