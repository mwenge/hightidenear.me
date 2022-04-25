--DROP TABLE TIDES;
--CREATE TABLE TIDES (
--  DATE_TIME TIME,
--  LONGITUDE REAL,
--  LATITUDE REAL,
--  STATION_ID VARCHAR(60),
--  TIDE REAL
--);
DROP TABLE HIGH_TIDES;
CREATE TABLE HIGH_TIDES (
  DATE_TIME TIME,
  STATION_ID VARCHAR(60),
  HIGH_TIDE VARCHAR(30)
);
.separator ","
--.import "000-IMI-TidePrediction_ce3d_f3ba_dd6b.csv" TIDES
.import "510-high_tides.csv" HIGH_TIDES
-- .import test.csv TIDES

--create index indx_datetime on TIDES (DATE_TIME);
--create index indx_stationid on TIDES (STATION_ID);
create index indx_datetime on HIGH_TIDES (DATE_TIME);
create index indx_stationid on HIGH_TIDES (STATION_ID);

pragma journal_mode = delete; -- to be able to actually set page size
pragma page_size = 1024; -- trade off of number of requests that need to be made vs overhead. 
-- insert into ftstable(ftstable) values ('optimize'); -- for every FTS table you have (if you have any)
vacuum; -- reorganize database and apply changed page size

