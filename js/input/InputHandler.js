define(["util/Point"],
function(Point)
{    
    function InputHandler()
    {
        this.up = false;
        this.down = false;
        this.right = false;
        this.left = false;
        this.mousePosition = new Point.Point();
    }

    InputHandler.prototype.update = function(event, scene) {
        switch(event.type) {
            case "mousemove":
                this.mousePosition.x = event.offsetX;
                this.mousePosition.y = event.offsetY;
                break;
            case "click":
                scene.click(this.mousePosition);
                break;
            case "contextmenu":
                scene.rightClick(this.mousePosition);
                break;
            default: // keyup or keydown
                switch(event.which) {
                    case 87: // w up
                        this.up = event.type === "keydown";
                        break;
                    case 65: // a left
                        this.left = event.type === "keydown";
                        break;
                    case 83: // s down
                        this.down = event.type === "keydown";
                        break;
                    case 68: // d right
                        this.right = event.type === "keydown";
                        break;
                }
        }
    }

    return {
        InputHandler: InputHandler
    };
});