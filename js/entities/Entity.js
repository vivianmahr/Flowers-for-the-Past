define(["util/Point", "util/goody", "util/Rect"],
function(Point, goody, Rect)
{    
    function Entity(x, y, z)
    {
        this.velocity = new Point.Point(0,0);
        this.acceleration = new Point.Point(0, 0);
        this.rect = new Rect.Rect(x, y, 1, 1);
        this.movementAttributes = {
            "height": goody.optional(z, 1.5),
            "temp": 1,
            "hum": 1, 
            "life": 1
        }
    }
    
    return {
        Entity:Entity
    };
});