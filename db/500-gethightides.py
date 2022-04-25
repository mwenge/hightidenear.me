#!/bin/python
"""
Create a look up table of approximate high tides for Seapoint.
This is based on data from https://erddap.marine.ie/erddap/tabledap/IMI-TidePrediction.html
which creates a tide prediction for Dublin_Port for up to 3 years.
"""
from scipy.signal import argrelextrema
import numpy as np
import itertools
from datetime import datetime, timedelta, timezone
import json
from suntime import Sun, SunTimeException
import sys
import csv

# Pass the new tides file as the first argument
i = open(sys.argv[1], 'r')

# GPS of Dublin Port
latitude = 53.34
longitude = -6.20
sun = Sun(latitude, longitude)

def roundTime(dt=None, roundTo=60*60):
   if dt == None : dt = datetime.now()
   seconds = (dt.replace(tzinfo=None) - dt.min).seconds
   rounding = (seconds+roundTo/2) // roundTo * roundTo
   return dt + timedelta(0,rounding-seconds,-dt.microsecond)

def is_daytime(dt):
    t = dt.time()
    return (sun.get_local_sunrise_time(dt.date()) < dt <= sun.get_local_sunset_time(dt.date()))


# Parse the tide predictions into a list of local time + tide level.
levels = [
  [
   datetime.strptime(k[0], "%Y-%m-%dT%H:%M:%S%z").astimezone(),
   k[3],
   float(k[4]),
  ]
  for k in [ l.strip().split(',') 
            for n, l in enumerate(i.readlines()[2:])]
]

# Identify the date and time of all all the peaks in the tide levels.
ilocs_max = argrelextrema(np.array([k[2] for k in levels]), np.greater_equal, order=3)[0]
# Remove any consecutive peaks, e.g. consecutive 5 minute intervals where the tide was high.
hw_levels = [levels[n] for i, n in enumerate(ilocs_max) if n-1 > ilocs_max[i-1] or i == 0]

# Convert the array of peaks into a list we can use
hw_levels_hr = [(roundTime(l[0]).strftime("%Y-%m-%d"),
                l[1],
                ("🌞" if is_daytime(roundTime(l[0])) else "🌜")
                 + " c. " + roundTime(l[0]).strftime("%I %p").lstrip("0"))
                for l in hw_levels ]

with open('510-high_tides.csv', 'w', newline='\n') as csvfile:
    output_file = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    output_file.writerows(hw_levels_hr)
