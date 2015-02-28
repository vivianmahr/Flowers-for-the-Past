define(["scene/Scene"],
function(Scene)
{    
    function MenuScene(buttons, images) {
        this.buttons = buttons;
        this.images = images;
    }

    MenuScene.prototype.update = function(input, delta) {
        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].contains(input.mousePosition)) {
                this.buttons[i].hover = true; // need a place where this is set to false
            }
        }
    }

    MenuScene.prototype.click = function(mousePosition) {
        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].contains(mousePosition)) { 
                this.buttons[i].clickFunction(this);
            }
        }       
    }

    MenuScene.prototype.display = function(ctx) {
        for (var i = 0; i < this.images.length; i++) {
            var toRender = this.images[i];
            ctx.drawImage(
                toRender,                                                   //image
                0,                                                          //x position on image
                0,                                                          //y position on image
                toRender.width,                                             //imageWidth on Source
                toRender.height,                                            //imageHeight on Source
                0,                                                          //xPosCanvas    
                0,                                                          //yPosCanvas    
                toRender.width,                                             //imageWidth on Canvas
                toRender.height                                             //imageHeight on Canvas                
            );
        }
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].display(ctx); 
        }
    }

    return {
        MenuScene: MenuScene
    };
});