#!/usr/bin/python3
"""
Create a look up table of approximate high tides for Seapoint.
This is based on data from https://erddap.marine.ie/erddap/tabledap/IMI-TidePrediction.html
which creates a tide prediction for Dublin_Port for up to 3 years.
"""
from scipy.signal import argrelextrema
import numpy as np
import itertools
from datetime import datetime, timedelta, timezone
import sys
import csv

def roundTime(dt, roundTo=60*60):
   seconds = (dt.replace(tzinfo=None) - dt.min).seconds
   rounding = (seconds+roundTo/2) // roundTo * roundTo
   return dt + timedelta(0,rounding-seconds,-dt.microsecond)

phase = "Sunset"
phases = {"Sunrise":"🌞", "Sunset":"🌜"}

csvfile = open('060-high_tides.csv', 'w', newline='\n')
output_file = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

i = open(sys.argv[1], 'r', encoding = "ISO-8859-1")
while True:
    k = i.readline()
    if not k:
        break
    l = k.strip().split(',')
    e = l[4]
    if e in ["Sunset", "Sunrise"]:
        phase = e
        continue
    if e == "Low Tide":
        continue

    station = l[0].replace("|",",")
    dt = datetime.strptime(l[1] + "T" + ' '.join(l[2].split(' ')[:2]), "%Y-%m-%dT%H:%M %p")
    info = phases[phase] + " c. " + roundTime(dt).strftime("%I %p").lstrip("0")
    output_file.writerow([roundTime(dt).strftime("%Y-%m-%d"), station, info])
