define(["entities/MainChar", "display/Camera", "entities/Cursor", "levels/maps", "assets/vars", "map/Map"],
function(MainChar, Camera, Cursor, maps, vars, Map)
{
    function mainLoop()
    {
        this.canvas = document.getElementById('canvas');
        this.canvas.width = vars.displayWidth;
        this.canvas.height = vars.displayHeight;
        this.input = [false, false, false, false]; // up right down left
        this.ctx = this.canvas.getContext('2d');
        this.camera = new Camera.Camera();
        this.MC = new MainChar.MainChar(600,600, 2.5);
        
        this.map = new Map.Map(maps.test_1);
        this.camera.loadMap(this.map);
                
        this.element = 0; 
        this.cursor = new Cursor.Cursor(this.element);
        this.resizeCanvas();
        
    };
    
    mainLoop.prototype.resizeCanvas = function()
    {
        this.canvas.style.marginTop = (window.innerHeight-vars.displayHeight)/2 + "px";
        this.draw();
    };
    
    mainLoop.prototype.updateInput = function(event)
    {   
        if (event.type == "mousemove")
        {
            this.cursor.move(event.layerX, event.layerY);
        }
        else if (event.type == "click")
        {
            var x = Math.floor((event.layerX-this.camera.offset.x)/(vars.tileDimension));
            var y = Math.floor((event.layerY-this.camera.offset.y)/(vars.tileDimension));
            var changeIndex = x + y * this.map.width;
            //this.map.bg[changeIndex] = this.applyElement(this.map.bg[changeIndex]);
            this.map.layers[3].data[changeIndex] = 13;
        }
        else if (event.type == "contextmenu")
        {
            this.element = this.element + 1 == 6 ? 0 : this.element + 1;
            this.cursor.setElement(this.element);
        }
        else //keyup or keydown
        {
            if (event.keyCode == 87) // up w
            { 
                this.input[0] = event.type == "keydown";
            }
            else if (event.keyCode == 68) // right d
            {
                this.input[1] = event.type == "keydown";
            }
            else if (event.keyCode == 83) // down s
            {
                this.input[2] = event.type == "keydown";
            }
            else if (event.keyCode == 65) // left a
            {
                this.input[3] = event.type == "keydown";
            }
        }
    }; 
    
    mainLoop.prototype.applyElement = function(tile)
    {
        var index = (tile-1)%81
        var el = this.element;
        if (el < 2)// wet, dry
        {
            var hum = Math.floor((index%27)/9);
            if ((el==0 && hum==2) || (el==1 && hum==0)) { return tile; }
            if (el==0) { return (tile + 9); } //wet
            return tile-9; // dry
        }
        else if (el < 4) // life, rot
        {
            var life = Math.floor(index/27);
            if ((el==2 && life==2) || (el==3 && life==0)) { return tile; }
            if (el==2) { return (tile + 27); } //life
            return tile-27; // dry
        }
        else // hot, cold
        {
            var temp =  Math.floor(index/3)%3;
            if ((el==4 && temp==2) || (el==5 && temp==0)) { return tile; }
            if (el==4) { return (tile + 3); } //hot
            return tile-3; // rot
        }
    };
    
    mainLoop.prototype.draw = function()
    {
        this.camera.display(this.canvas, this.ctx, this.map, this.MC, this.cursor, []);
    };
    
    mainLoop.prototype.update = function()
    {
        this.MC.update(this.input, this.map);
        this.draw();
    };
    
    mainLoop.prototype.str = function()
    {
    };
    
    return {
        mainLoop : mainLoop
    };
});