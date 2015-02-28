define(["display/Animation", "physics/Vector", "lib/goody"],
function(Animation, Vector, goody)
{    
    function MapCursor(element) {
        this.position = new Vector.Vector(0,0); 
        this.sprite = new Animation.Animation(images.dragonfly, 2, 19, 18);
        this.setElement(element);
        this.offset = new Vector.Vector(5 * element, 0);
        this.element = element;
        this.elementCap = 5;
    };

    MapCursor.prototype.display = function(ctx) {
        this.sprite.display(ctx, this.position);
    }

    MapCursor.prototype.update = function(input) {
        this.move(input);
        this.sprite.update();
    }
    
    MapCursor.prototype.setElement = function(e) {
        this.element = e;
        this.sprite.setOffsetY(e * 144);
    };
    
    MapCursor.prototype.move = function(input) {
        var x = input.mousePosition.x;
        var y = input.mousePosition.y;
        var angle = new Vector.Vector(this.position.x - x, this.position.y - y);
        // Update the sprite... when you decide the sprite... 
        this.position.x = x;
        this.position.y = y;
    };
                
    return {
        MapCursor:MapCursor
    }    
});