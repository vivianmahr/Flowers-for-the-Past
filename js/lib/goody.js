define([],
function()
{    
    function arrayEquals(a1, a2) {
        if (a1.length === a2.length) {
            for (var i = 0; i < a1.length; i++) {
                if (a1[i] !== a2[i]) {
                    return false;
                }
            }
            return true
        }
        return false
    }
    function optional(arg, dfault) {
        return (typeof arg === "undefined") ? dfault : arg;
    };

    function cap(value, lower, upper) {
        return ((value <= lower) ? lower : ((value >= upper) ? upper : value));
    };

    function randint(lower, upper) {
        return Math.floor((Math.random() * (upper + 1))) + lower;
    }
    
    function allSame(arr) {
        if (arr.length == 0) { return true; }
        var val = arr[0];
        var len = arr.length;
        while (len--) {
            if (arr[len] != val) { return false; }
        }
        return true;
    }

    function stringContains(string1, string2) {
        return string1.indexOf(string2) != -1;
    }

    function inArray(arr, searchFor) {
        for (var i = 0; i < arr.length; i++){
            if (arr[i] == searchFor) {
                return true;
            }
        }
        return false;
    }

    function incrementLoop(num, max) {
        return num + 1 === max ? 0 : num + 1;
    }
    
    return {
        optional: optional,
        cap: cap, 
        randint: randint,
        allSame: allSame,
        stringContains: stringContains,
        inArray: inArray,
        incrementLoop: incrementLoop,
        arrayEquals: arrayEquals
    };
});