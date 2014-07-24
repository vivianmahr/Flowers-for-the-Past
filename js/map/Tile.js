define(["util/goody", "util/Point", "assets/vars", "util/Rect"],
function(goody, Point, vars, Rect)
{   
    function Tile(x, y, BG1, BG2, EF1, EF2)
    {
        this.baseType = "floor";    // for applying elements, depends on ul corner
        this.baseElement = [0,0,0];
        this.appliedElement = [-2, -2, -2]; 
        this.rect = new Rec.Rect(x, y, vars.tileDimension*2, vars.tileDimension*2);
        this.rect.position.z = 0; // should vary depending on baseType
        this.renderList = {
            "BG1" : BG1,
            "BG2" : BG2,
            "EF"  : EF,
            
        }
    }
    
    Tile.prototype.render = function(ctx)
    {
    }
    
    Tile.prototype.onCollision = function()
    {
    }
    
    Tile.prototype.applyElement = function()
    {
    }
    
    return {
        Tile: Tile
    };
});