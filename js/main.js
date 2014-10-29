function start() {
    require(["mainLoop", "assets/vars"],
    function(mainLoop, vars) 
    {    
        var main = new mainLoop.mainLoop();
        function resize() { main.resizeCanvas(); }
        function ev(event) { main.updateInput(event); }
        
        var canvas = document.getElementById('canvas');
        
        canvas.addEventListener("contextmenu", ev);
        canvas.addEventListener("mousemove", ev);
        canvas.addEventListener("click", ev);
        
        window.addEventListener('resize', resize);
        window.addEventListener('keyup', ev);
        window.addEventListener('keydown', ev);
        
        // not sure what this does
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        var lastTime = (new Date()).getTime();
        var currentTime = 0;
        var timeDelta = 0;

        function start() {
	console.log("inside inside");
            window.requestAnimationFrame(start);
            currentTime = (new Date()).getTime();
            timeDelta = currentTime - lastTime;
            if(timeDelta > vars.interval) 
            {
                main.update(timeDelta); 
                timeDelta = 0;           
                lastTime = currentTime;
            }
        }


    });
}
