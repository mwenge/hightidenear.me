#!/usr/bin/python3
import os, json
import shlex, subprocess

os.remove("040-Tides.csv")
json_file = open('020-stations.json')
stations = json.load(json_file)
for s in stations:
    cmd = "tide -l \"" + s["station"].strip() + "\" -em pMm -b \"2022-04-23 00:00\" -e \"2025-04-23 00:00\" -tf \"%H:%M %p %Z\"  -f c -o 040-Tides.csv"
    args = shlex.split(cmd)
    print(args)
    subprocess.run(args)
