images = {
    MC: new Image(),
    cursor: new Image(),
    BaseTiles: new Image(),
    dragonfly: new Image(),
}

images.dragonfly.src = "images/dragonfly.png";
images.MC.src = "images/MC.png";
images.BaseTiles.src = "images/BaseTiles.png";
images.cursor.src = "images/cursor.png";
images.dragonfly.onload = start;
