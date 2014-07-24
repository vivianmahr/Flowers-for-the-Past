define(["util/goody"],
function(goody)
{    
    function optional(arg, dfault)
    {
        return (typeof arg === "undefined") ? dfault : arg;
    };

    function cap(value, lower, upper)
    {
        return ((value <= lower) ? lower : ((value >= upper) ? upper : value));
    };

    function randint(lower, upper){
        return Math.floor((Math.random()*(upper+1)))+lower;
    }
    
    function allSame(arr)
    {
        if (arr.length == 0) { return true; }
        var val = arr[0];
        var len = arr.length;
        while (len--)
        {
            if (arr[len] != val) { return false; }
        }
        return true;
    }
    
    return {
        optional:optional,
        cap:cap, 
        randint:randint,
        allSame: allSame
    };
});