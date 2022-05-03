# Building the DB

## Generate global high tides using xtide

Copy the harmonics files from wxtide:
```
sudo cp harmonics-2004-06-14.tcd /usr/share/xtide
```

Run the following to generate a high tides file:
```
tide -f t -m l > 000-XTide-Stations.csv
./010-DumpStationsAsJSON.py
./030-GenerateTideCSV.py
./050-gethightides.py
```

## Use the local data from marine.ie
Go to:
  https://erddap.marine.ie/erddap/tabledap/IMI-TidePrediction.html

![image](https://user-images.githubusercontent.com/58846/164282272-6012d3db-264e-47aa-bbfc-054e74adaa15.png)

Download a `csv` with the latest predictions for as far out as the interface will allow. Save it to
`000-input.csv` then rerun `500-gethightides.py` as follows:
```sh
500-gethightides.py 000-input.csv
```

This will write the results to `510-high_tides.csv`.

Now run:
```sh
./910-create_db.sh
```
This will create `999-tides.db` which will be used to serve the high tide info.

