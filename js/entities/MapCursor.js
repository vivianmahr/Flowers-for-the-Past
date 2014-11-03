define(["display/Animation", "util/Point"],
function(Animation, Point)
{    
    function MapCursor(i)
    {
        this.position = new Point.Point(0,0); 
        this.sprite = new Animation.Animation(images.dragonfly, 2, 19, 18);
        this.offset = new Point.Point(5*i,0);
    };

    MapCursor.prototype.display = function(ctx){
        this.sprite.display(ctx, this.position);
    }

    MapCursor.prototype.update = function(input) {
        this.move(input);
        this.sprite.update();
    }
    
    MapCursor.prototype.setElement = function(i)
    {
        this.offset.x = 5*i;
    };
    
    MapCursor.prototype.move = function(input)
    {
        var x = input.mousePosition.x;
        var y = input.mousePosition.y;
        var dx = this.position.x - x;
        var dy = this.position.y - y;// right and down are negative
        if (dx < 0) { this.sprite.orient("R"); }
        if (dx > 0) { this.sprite.orient("L"); }
        if (dy > 0) { this.sprite.orient("U"); }
        if (dy < 0) { this.sprite.orient("D"); }
        this.position.x = x;
        this.position.y = y;
    };
                
    return {
        MapCursor:MapCursor
    }    
});