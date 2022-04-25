# Building the DB
Every now and then go to:
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

