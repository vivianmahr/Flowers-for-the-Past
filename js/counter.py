import os
lines = 0
files = list(os.listdir("."))
while len(files) != 0:
    file = files.pop();
    if os.path.isdir(file):
        if file != "maps/tests":
            for f in os.listdir(file):
                files.append(file + "/" + f)
    elif file != "counter.py" and file !="require.js":
        print(file)
        temp = open(file, "r")
        lines += len(temp.readlines())
        temp.close()
    
input(lines)
