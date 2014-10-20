define(["util/Point", "util/goody", "util/Rect"],
function(Point, goody, Rect)
{    
    function Entity(x, y, z)
    {
        this.velocity = new Point.Point(0,0);
        this.rect = new Rect.Rect(x, y, 1, 1);
        this.velCap = 3;
        this.movementAttributes = {
            "height": goody.optional(z, 1),
            "temperature": 1,
            "humidity": 1, 
            "growth": 1,
            "airborne": false,
            "sinking": false
        }
    }
    
    return {
        Entity:Entity
    };
});