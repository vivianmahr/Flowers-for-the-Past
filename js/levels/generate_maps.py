import os

LEVELS_DIR = ".\\json\\"

def is_json(filename):
    return filename[-5:] == ".json"

def readfile(filename):
    file = open(filename)
    results = file.read()
    file.close()
    return results

def gen_results(path):
    results = []
    for obj in os.listdir(path):
        new_path = os.path.join(path, obj)
        if os.path.isdir(new_path):
            results += gen_results(new_path)
        elif is_json(new_path):
            results.append(new_path)
    return results

def get_name(path):
    path = path.split('\\')
    return path[-1][:-5]

def generate_map_file(levels):
    result = "define([],\nfunction()\n{"
    filenames = []
    for level in levels:
        name = get_name(level)
        filenames.append(name)
        result += "\n" + name + " = " + readfile(level)
    result += "\n\nreturn {\n"
    for file in filenames:
        result += "\t{0} : {0},\n".format(file)
    result += "\n    };\n});"
    file = open("maps.js", "w")
    file.write(result)
    file.close()
    

d = gen_results(LEVELS_DIR)
generate_map_file(d)
