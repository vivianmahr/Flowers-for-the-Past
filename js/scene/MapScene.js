define(["scene/Scene", "map/Map" , "entities/MapCursor", "entities/MainChar", "physics/CollisionHandler", "display/MapCamera"],
function(Scene, Map, MapCursor, MainChar, CollisionHandler, MapCamera) {    
    MapScene.prototype = new Scene.Scene();
    MapScene.prototype.constructor = MapScene;

    function MapScene(ctx, json, currentElement, MCx, MCy, MCz) {
        this.map = new Map.Map(json);
        this.cursor = new MapCursor.MapCursor(this.currentElement);
        this.element = currentElement;
        this.MC = new MainChar.MainChar(MCx, MCy, MCz);
        this.collisionHandler = new CollisionHandler.CollisionHandler();
        this.camera = new MapCamera.MapCamera(ctx);
        this.camera.loadMap(this.map);
    }

    MapScene.prototype.update = function(input, delta) {
        this.MC.update(input, this.map, this.collisionHandler, delta)
        this.cursor.update(input);
    }

    MapScene.prototype.click = function(mousePosition) {
    }

    MapScene.prototype.rightClick = function(mousePosition) {
    }

    MapScene.prototype.display = function() {
        this.camera.display(this.MC, this.cursor, []);
    }

    MapScene.prototype.nextScene = function() {
        if (!this.switchScenes) {
            throw new Error("switchScenes is false");
        }
    }

    return {
        MapScene: MapScene
    };
});