define(["util/goody", "entities/MainChar", "display/MapCamera", "entities/Cursor", "levels/maps", "assets/vars", "map/Map", "physics/CollisionHandler"],
function(goody, MainChar, MapCamera, Cursor, maps, vars, Map, CollisionHandler)
{
    function mainLoop()
    {
        this.canvas = document.getElementById('canvas');
        this.canvas.width = vars.displayWidth;
        this.canvas.height = vars.displayHeight;

        // Change to input handler..
        this.input = [false, false, false, false]; // up right down left
        this.ctx = this.canvas.getContext('2d');

        this.mapCamera = new MapCamera.MapCamera();
        // this.menuCamera = new MenuCamera.MenuCamera();

        
        // cut this out or move to scene
        this.cursor = new Cursor.Cursor(this.element);
        this.collisionHandler = new CollisionHandler.CollisionHandler();
        this.MC = new MainChar.MainChar(500, 500, 0);
        this.element = 0; 
        this.map = new Map.Map(maps.debug_3);
        this.mapCamera.loadMap(this.map);
        
        this.resizeCanvas();  
    };
    
    mainLoop.prototype.resizeCanvas = function()
    {
        this.canvas.style.marginTop = (window.innerHeight-vars.displayHeight)/2 + "px";
        this.draw();
    };
    
    mainLoop.prototype.updateInput = function(event)
    {   
        if (event.type == "mousemove") {
            this.cursor.move(event.layerX, event.layerY);
        }
        else if (event.type === "click") {
            var x = Math.floor((event.layerX-this.mapCamera.offset.x)/(vars.tileDimension));
            var y = Math.floor((event.layerY-this.mapCamera.offset.y)/(vars.tileDimension));
            var changeIndex = x + y * this.map.width;
            console.log(changeIndex);

            console.log($("canvas").width());
            // this.map.applyElement(changeIndex, this.element);
        }
        else if (event.type === "contextmenu")
        {
            this.element = goody.incrementLoop(this.element, 6);
            this.cursor.setElement(this.element);
        }
        else //keyup or keydown, change this to use jquery...
        {
            if (event.keyCode === 87) // up w
            { 
                this.input[0] = event.type === "keydown";
            }
            else if (event.keyCode === 68) // right d
            {
                this.input[1] = event.type == "keydown";
            }
            else if (event.keyCode === 83) // down s
            {
                this.input[2] = event.type === "keydown";
            }
            else if (event.keyCode === 65) // left a
            {
                this.input[3] = event.type === "keydown";
            }
        }
    }; 
    
    mainLoop.prototype.draw = function()
    {
        this.mapCamera.display(this.canvas, this.ctx, this.map, this.MC, this.cursor, []);
    };
    
    mainLoop.prototype.update = function(delta)
    {
        this.MC.update(this.input, this.map, this.collisionHandler, delta);
        this.cursor.update();
        this.draw();
    };
    
    mainLoop.prototype.str = function()
    {
    };
    
    return {
        mainLoop : mainLoop
    };
});