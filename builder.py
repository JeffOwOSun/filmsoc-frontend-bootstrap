import os
import json
import fileinput
import subprocess
import sys

def main():
    '''
    For debugging. Flagging it True will prevent obfuscation
    '''
    debugging=True
    
    '''
    opens the json configuration file
    json.loads turns json into a dictionary
    '''
    config_f = open("js_build.json", "r")
    config = json.loads(config_f.read())

    header = "/**\n"
    for line in open(config["header"], "r"):
        header += " * " + line
    header += "\n */\n"

    prefix = config.get("prefix", './')
    compressor = config["yuicompressor"]

    for k, v in config["jobs"].iteritems():
        '''
        k is a key, which is the name of the target js file, 
        and v is a value, which will be a list here, since it's denoted using "[]"
        map() applies the anonymous function denoted by keyword lambda on every term inside v
        the result is a v list where each item is appended at the beginning with a path
        '''
        v = map(lambda x: prefix + x, v)
        '''
        run the yui compressor with commandline
        '''
        command = "java -jar pl1 -o pl2 pl3 --type js".split(' ')
        command[2] = compressor
        command[4] = k
        if debugging:
            command[5] = "--nomunge"
        else:
            command[5] = ""
        
        print "Processing for %s" % k
        print "Using: %s" % ' '.join(command) #' '.join(command), is to join the command list using ' ' as separators
        sys.stdout.flush()
        p = subprocess.Popen(command, stdin=subprocess.PIPE, stderr=subprocess.PIPE)

        lines = [0]
        cur_line = 0
        try:
            for in_f in v:
                print "Processing: %s" % in_f
                for line in open(in_f, "r"):
                    try:
                        p.stdin.write(line)
                    except:
                        print "error on line: %s" % line
                    if not line.endswith('\n'):
                        p.stdin.write('\n')
                    p.stdin.flush()
                    cur_line += 1
                lines.append(cur_line)
        finally:
            p.stdin.close()

        parse = False
        for line in p.stderr:
            if parse:
                # parse line number
                (ln, pos, after) = line.partition(':')
                ln = int(ln.strip())
                for i in xrange(1, len(lines) + 1):
                    if ln <= lines[i]:
                        print "%s:%d:%s" % (v[i - 1], ln - lines[i - 1], after),
                        break;
                parse = False
            else:
                if line.startswith("[ERROR]"):
                    print line,
                    parse = True
                else:
                    break;
        p.wait()

        for ln, line in enumerate(fileinput.input(k, inplace=1)):
            if ln == 0:
                print header
            print line

if __name__ == "__main__":
    main()
