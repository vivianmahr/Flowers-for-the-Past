define([],
function()
{
    var directions = {
        "U" : 0,
        "UR" : 1,
        "R" : 2,
        "DR" : 3,
        "D" : 4,
        "DL" : 5,
        "L" : 6,
        "LU" : 7,
    }
    var fps = 30;
    return {
        displayHeight: 528,
        displayWidth: 748,
        tileDimension: 24,
        propertiesOffset: 4,
        tileSetHeight: 12,
        tileSetWidth:12,
        mapLength: 144,
        fps: fps,
        interval: 1000/fps,
        directions: directions
    }
});
