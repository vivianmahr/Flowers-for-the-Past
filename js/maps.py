import os

result = open("levels/maps.js", "w")
l = [os.path.abspath(x) for x in os.listdir(("../maps/maps/"))]
result.write("""
define([],
function()
{""")

print(l)

while len(l) != 0:
    file = l.pop()
    print(os.path.isdir("../maps/maps/tests"), file)
    if os.path.isdir(file):
        for f in os.listdir(file):
            l.append(os.path.relpath(f))
    elif file[-5:] == ".json":
        print(file)
        temp = open(file, "r")
        result.write("\n" + file.split("/")[-1][:-5] + " = " + temp.read());
        temp.close()
result.write("""
    return {
    };
});
"""
)
result.close()








