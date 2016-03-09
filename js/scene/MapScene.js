define(["physics/Vector", "lib/goody", "scene/Scene", "map/Map" , "entities/MapCursor", "entities/MainChar", "physics/CollisionHandler", "display/MapCamera"],
function(Vector, goody, Scene, Map, MapCursor, MainChar, CollisionHandler, MapCamera) 
{    
    MapScene.prototype = new Scene.Scene();
    MapScene.prototype.constructor = MapScene;

    function MapScene(ctx, json, currentElement) {
        this.map = new Map.Map(json);
		console.log(this.map);
        this.cursor = new MapCursor.MapCursor(currentElement);
        this.element = currentElement;
        this.MC = new MainChar.MainChar();
		
		var objects = this.map.objects;
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].name === "MC_spawn") {
			console.log(objects[i]);
				this.MC.setPosition(objects[i].x, objects[i].y);
				this.MC.movementAttributes.height = objects[i].properties.MC_height;
			}
		}
        this.loadEntities();
        this.collisionHandler = new CollisionHandler.CollisionHandler();
        this.camera = new MapCamera.MapCamera(ctx);
        this.camera.loadMap(this.map);
        this._elementCap = 6; // should be in some global state variable
    }

    MapScene.prototype.loadEntities = function() {
        this._entities = this.map.objects;
        this._events = this.map.eventMap;
    }

    MapScene.prototype.update = function(input, delta) {
        this.MC.update(input, this.map, this.collisionHandler, delta)
        this.cursor.update(input);
    }

    MapScene.prototype.click = function(mousePosition) {
        this.map.applyElement(this.camera.absolutePosition(mousePosition), this.element);
        this.camera.reloadMap(this.map); // do this more efficiently haha
    }

    MapScene.prototype.rightClick = function(mousePosition) {
        this.element = goody.incrementLoop(this.element, this._elementCap);
        this.cursor.setElement(this.element);
    }

    MapScene.prototype.display = function() {
        this.camera.display(this.MC, this.cursor, []);
    }

    MapScene.prototype.nextScene = function() {
        // Should depends on the map and a few other things
        if (!this.switchScenes) {
            throw new Error("switchScenes is false");
        }
    }

    return {
        MapScene: MapScene
    };
});