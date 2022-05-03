#!/usr/bin/python3
# tide -f t -m l
import json
input_file = open("000-XTide-Stations.csv", 'r')
l = [
        {
        "station": i[:51].strip(),
        "lat": ("-" if i[65:66] == "S" else "") + i[56:63].strip(),
        "lon": ("-" if i[78:79] == "W" else "") + i[68:76].strip()
        }
     for i in  input_file.readlines()
     if i[52:55] == "Ref"
]
output_file = open("020-stations.json", 'w')
output_file.write(json.dumps(l, indent=True))

