define(["util/goody"],
function(goody)
{    
    function Point(x, y, z){
        this.x = goody.optional(x, 0);
        this.y = goody.optional(y, 0);
        this.z = goody.optional(z, 0);
    };

    Point.prototype.add = function(point2){
        return new Point(this.x + point2.x, this.y + point2.y, this.z + point2.z);
    };

    Point.prototype.mult = function(i) {
        this.x = this.x * i;
        this.y = this.y * i;
        this.z = this.z * i;
    };

    Point.prototype.length = function() {
        var x = this.x;
        var y = this.y;
        var z = this.z
        return Math.sqrt(x*x + y*y + z*z);
    };

    Point.prototype.setLength = function(len) {
        var currentLength = this.length();
        this.x = this.x * len / currentLength;
        this.y = this.y * len / currentLength;
        this.z = this.z * len / currentLength;
    };
    
    return {
        Point:Point
    };
});