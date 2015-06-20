define([],
function()
{
    // For the direction the object is facing, done on the Y-axis of the image
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

    // FPS is used in interval calculations, defined here
    var fps = 30;

    // Offset for each element on the tilesheet (units = tiles, not pixels)
    var elementalTileOffsets = {
        "Humidity": 72,
        "Temperature": 24,
        "Growth": 8
    }

    return {
        displayHeight: 528,
        displayWidth: 748,
        tileDimension: 24,
        tileSetHeight: 12,
        tileSetWidth:12,
        mapLength: 144,
        fps: 30,
        interval: 1000/fps,
        directions: directions,
        elementalTileOffsets: elementalTileOffsets,
        tileSetTileWidth: 216
    }
});
