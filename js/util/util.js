function Point(x, y){
    this.x = x;
    this.y = y;
};

Point.prototype.add = function(point2)
{
    return new Point(this.x + point2.x, this.y + point2.y);
};

Point.prototype.mult = function(i)
{
    this.x = this.x * i;
    this.y = this.y * i;
};

Point.prototype.length = function()
{
    return Math.sqrt(this.x*this.x + this.y*this.y);
};

Point.prototype.setLength = function(len)
{
    var currentLength = this.length();
    this.x = this.x * len / currentLength;
    this.y = this.y * len / currentLength;
};
  

function Rect(x, y, width, height)
{
    this.upperLeft = new Point(x, y);
    this.height = height;
    this.width = width;
};

Rect.prototype.pointCollide = function(p)
{
    var xp = p.x;
    var yp = p.y;
    var x = this.upperLeft.x;
    var y = this.upperLeft.y;
    return (xp>x && xp<(x+this.width) && yp>y && yp<(y+this.height));
};

Rect.prototype.rectCollide = function(rect)
{
    var tL = this.upperLeft.x;
    var tU = this.upperLeft.y;
    var oL = rect.upperLeft.x;
    var oU = rect.upperLeft.y;
};

/*
function intersectRect(r1, r2) {
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

*/