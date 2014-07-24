define(["util/Point", "assets/images"],
function(Point, images)
{    
    function Cursor(i)
    {
        this.position = new Point.Point(0,0); 
        this.image = images.cursor;
        this.offset = new Point.Point(5*i,0);
    };
    
    Cursor.prototype.setElement = function(i)
    {
        this.offset.x = 5*i;
    };
    
    Cursor.prototype.move = function(x, y)
    {
        this.position.x = x;
        this.position.y = y;
    };
                
    return {
        Cursor:Cursor
    }    
});