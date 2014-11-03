define(["util/goody", "util/Point"],
function(goody, Point)
{    
    function Rect(x, y, width, height){
        this.position = new Point.Point(x, y);
        this.width = width;
        this.height = height;
    };

    Rect.prototype.getLeft = function() { return this.position.x; };
    Rect.prototype.getRight = function() { return this.position.x + this.width; };
    Rect.prototype.getTop = function() { return this.position.y; };
    Rect.prototype.getBottom = function() { return this.position.y + this.height; };
    
    Rect.prototype.setLeft = function(x) { this.position.x = x; };
    Rect.prototype.setRight = function(x) { this.position.x = x - this.width; };
    Rect.prototype.setTop = function(y) { this.position.y = y; };
    Rect.prototype.setBottom = function(y) { this.position.y = y - this.height; };
    
    Rect.prototype.center = function() { return Point.Point(this.position.x + Math.floor(this.width/2), this.position.y + Math.floor(this.height/2)); }; 
    Rect.prototype.collideRect = function(r2) { return !(this.getLeft() > r2.getRight() || this.getRight() < r2.getLeft() || this.getTop() > r2.getBottom() || this.getBottom() < r2.getTop()); };
    Rect.prototype.collidePoint = function(p) { return (p.x > this.getLeft() && p.x < this.getRight() && p.y < this.getBottom() && p.y > this.getTop()); };
    
    Rect.prototype.getCorners = function() { 
    // Upper Left, Upper Right, Lower Left, Lower Right
        return [
            new Point.Point(this.position.x, this.position.y),
            new Point.Point(this.position.x + this.width, this.position.y),
            new Point.Point(this.position.x, this.position.y + this.height),
            new Point.Point(this.position.x + this.width, this.position.y + this.height),
        ];
    }
    
    Rect.prototype.draw = function(ctx, offset, color) {
        ctx.fillStyle = goody.optional(color, (Math.random().toString(16) + '000000').slice(2, 8));
        ctx.fillRect(this.position.x + offset.x, this.position.y + offset.y, this.width, this.height);
    }
    
    Rect.prototype.adjacent = function(r2) {
        return (this.getLeft() == r2.getRight() || this.getRight() == r2.getLeft() || this.getTop() == r2.getBottom() || this.getBottom() == r2.getTop());
    }; 
    
    Rect.prototype.mergeable = function(r2) {
        // this and r2 are left and right of each other
        if (this.getLeft() == r2.getRight() || this.getRight() == r2.getLeft()) {
            return (this.height == r2.height && this.getBottom() == r2.getBottom());
        }
        // this and r2 are on top of each other
        else if (this.getTop() == r2.getBottom() || this.getBottom() == r2.getTop()){
            return (this.width == r2.width && this.getLeft() == r2.getLeft());
        }
        return false;
    } 
    
    Rect.prototype.merge = function(r2) {
        // this rect is to the right of r2
        if (this.getLeft() == r2.getRight()) {
            return new Rect(r2.position.x, this.position.y, this.width + r2.width, this.height);
        }
        // this rect is to the left of r2 X
        else if (this.getRight() == r2.getLeft()) {   
            return new Rect(this.position.x, r2.position.y, this.width + r2.width, this.height);
        }
        // this rect is below r2
        else if (this.getTop() == r2.getBottom()) {   
            return new Rect(this.position.x, r2.position.y, this.width, this.height + r2.height);
        }
        // this rect is above r2
        else if (this.getBottom() == r2.getTop()){   
            return new Rect(this.position.x, this.position.y, this.width, this.height + r2.height);
        }
    }
    
    return {
        Rect:Rect
    };
});