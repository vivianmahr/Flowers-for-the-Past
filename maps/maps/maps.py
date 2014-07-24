import os

result = open("../../js/levels/maps.js", "w")
l = [f for f in os.listdir(".")]
result.write("""define([],
function()
{""")
exports = []
while len(l) != 0:
    file = l.pop()
    if os.path.isdir(file):
        for f in os.listdir(file):
            l.append(file + "/" + f)
    elif file[-5:] == ".json":
        exports.append(file.split("/")[-1][:-5])
        temp = open(file, "r")
        result.write("\n" + file.split("/")[-1][:-5] + " = " + temp.read());
        temp.close()
result.write("""
    return {\n""")

for f in exports:
    result.write("    {0}: {0},\n".format(f))
result.write("""
    };
});
"""
)
result.close()








