var imageNames = [
	"dragonfly",
	"MC",
	"BaseTiles" ,
    "startButton",
    "titleScreen"   
]

var images = {};

$(function() {  
    var loaded = 0;
    var numImages = imageNames.length;
    for (var i = 0; i < numImages; i++) {
        var index = imageNames[i];
    	images[index] = new Image();
        images[index].src = "images/" + index + ".png";
        images[index].onload = function(){ 
            loaded++;
            if (loaded === numImages) {
                start();
            } 
        }
    }
 });
