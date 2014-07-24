function start() {
    require(["mainLoop", "assets/images"],
    function(mainLoop) 
    {    
        var main = new mainLoop.mainLoop();
        function draw() { main.update(); }
        function resize() { main.resizeCanvas(); }
        function ev(event) { main.updateInput(event); }
        
        var canvas = document.getElementById('canvas');
        
        canvas.addEventListener("contextmenu", ev);
        canvas.addEventListener("mousemove", ev);
        canvas.addEventListener("click", ev);
        
        window.addEventListener('resize', resize);
        window.addEventListener('keyup', ev);
        window.addEventListener('keydown', ev);
        
        window.setInterval(draw, 10);
    });
}

