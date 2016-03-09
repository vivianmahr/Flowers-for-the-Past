define(["physics/Vector", "input/Button", "scene/MenuScene", "scene/MapScene", "input/InputHandler","lib/goody", "entities/MainChar", "display/MapCamera", "levels/maps", "assets/vars", "map/Map", "physics/CollisionHandler"],
function(Vector, Button, MenuScene, MapScene, InputHandler, goody, MainChar, MapCamera, maps, vars, Map, CollisionHandler)
{
    function mainLoop() {
        this.canvas = document.getElementById('canvas');
        this.canvas.width = vars.displayWidth;
        this.canvas.height = vars.displayHeight;

        this.input = new InputHandler.InputHandler(); 
        this.ctx = this.canvas.getContext('2d');
        /*
        this.scene = new MenuScene.MenuScene(
            [new Button.Button(images.startButton, 
                new Vector.Vector(520, 200), 
                function(masterScene) {
                    masterScene.switchScenes = true;
                    //hacky...
                    masterScene.nextScene = function() { return new MapScene.MapScene(document.getElementById('canvas').getContext("2d"), maps.debug_3, 0, 500, 500, 0); }
                }
            )], 
            [images.titleScreen])
        ;
        */
        this.scene = new MapScene.MapScene(this.ctx, maps.debug_5, 0);
        // this.scene = new MapScene.MapScene(this.ctx, maps.intro_0, 3, 50, 80, 7, true);
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