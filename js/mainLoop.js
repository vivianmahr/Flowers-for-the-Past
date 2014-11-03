define(["util/Point", "input/Button", "scene/MenuScene", "scene/MapScene", "input/InputHandler","util/goody", "entities/MainChar", "display/MapCamera", "levels/maps", "assets/vars", "map/Map", "physics/CollisionHandler"],
function(Point, Button, MenuScene, MapScene, InputHandler, goody, MainChar, MapCamera, maps, vars, Map, CollisionHandler)
{
    function mainLoop() {
        this.canvas = document.getElementById('canvas');
        this.canvas.width = vars.displayWidth;
        this.canvas.height = vars.displayHeight;

        // Change to input handler..
        this.input = new InputHandler.InputHandler(); // up right down left
        this.ctx = this.canvas.getContext('2d');

        // this.mapCamera = new MapCamera.MapCamera(this.ctx);
        // this.menuCamera = new MenuCamera.MenuCamera();

        this.scene = new MenuScene.MenuScene(
            [new Button.Button(images.startButton, 
                new Point.Point(520, 200), 
                function(masterScene) {
                    masterScene.switchScenes = true;
                    masterScene.nextScene = function() { return new MapScene.MapScene(maps.debug_3, 0, 500, 500, 0); }
                }
            )], 
            [images.titleScreen])
        ;
        this.scene = new MapScene.MapScene(this.ctx, maps.debug_3, 0, 500, 500, 0);
        
        // cut this out or move to scene
        // this.collisionHandler = new CollisionHandler.CollisionHandler();
        // this.MC = new MainChar.MainChar(500, 500, 0);
        // this.element = 0; 
        // this.map = new Map.Map(maps.debug_3);
        // this.mapCamera.loadMap(this.map);
        
        this.resizeCanvas();  
    };
    
    mainLoop.prototype.resizeCanvas = function() {
        this.canvas.style.marginTop = (window.innerHeight-vars.displayHeight)/2 + "px";
        this.draw();
    };
    
    mainLoop.prototype.updateInput = function(event) {   
        this.input.update(event, this.scene);
    }; 
    
    mainLoop.prototype.draw = function() {
        this.scene.display(this.ctx);
    };
    
    mainLoop.prototype.update = function(delta) {
        if (this.scene.switchScenes) {
            this.scene = this.scene.nextScene();
        }
        this.scene.update(this.input, delta);
    };
    
    return {
        mainLoop : mainLoop
    };
});