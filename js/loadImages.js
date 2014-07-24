images = {
    MC: new Image(),
    cursor: new Image(),
    _000: new Image(),
    _100: new Image(),
    _n100: new Image(),
    _010: new Image(),
    _0n10: new Image(),
    _001: new Image(),
    _00n1: new Image(),
    _debug: new Image()
}

images.MC.src = "images/MCFront.png",
images.cursor.src = "images/cursor.png";
images._000.src = "images/0 0 0.png";
images._100.src = "images/1 0 0.png";
images._n100.src = "images/-1 0 0.png";
images._010.src = "images/0 1 0.png";
images._0n10.src = "images/0 -1 0.png";
images._001.src = "images/0 0 1.png";
images._00n1.src = "images/0 0 -1.png";
images._debug.src = "images/processing.png";
images._00n1.onload = start;
