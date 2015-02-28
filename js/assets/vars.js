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

    var singleElements = {
        "111": 1,
        // Hum
        "211": 1,
        "011": 1,
        // Temp
        "121": 1,
        "101": 1,
        // Growth
        "112": 1,
        "110": 1,
    }
    // For element offsets, done on the X-axis of the image
    // TODO: Rearrange so that single-element numbers are at the beginning
    // for cursor and seed spores and MC variations
    var elements = {
        "000": 0,
        "001": 1,
        "002": 2,
        "010": 3,
        "011": 4,
        "012": 5,
        "020": 6,
        "021": 7,
        "022": 8,
        "100": 9,
        "101": 10,
        "102": 11,
        "110": 12,
        "111": 13,
        "112": 14,
        "120": 15,
        "121": 16,
        "122": 17,
        "200": 18,
        "201": 19,
        "202": 20,
        "210": 21,
        "211": 22,
        "212": 23,
        "220": 24,
        "221": 25,
        "222": 26
    }

    // FPS is used in interval calculations, defined here
    var fps = 30;

    return {
        displayHeight: 528,
        displayWidth: 748,
        tileDimension: 24,
        // ...I forgot what this is but it varies from tilesheet to tilesheet, old one was +4
        propertiesOffset: -202,
        tileSetHeight: 12,
        tileSetWidth:12,
        mapLength: 144,
        fps: 30,
        interval: 1000/fps,
        directions: directions
    }
});
