import { createDbWorker } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

export async function load(station:string, today:string) {
  const worker = await createDbWorker(
    [
      {
        from: "inline",
        config: {
          serverMode: "full",
          url: "../db/999-tides.db",
          requestChunkSize: 4096,
        },
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

  const query = `select *
from HIGH_TIDES 
WHERE DATE(DATE_TIME) = '` + today + `'
AND
STATION_ID = "` + station + `"`;
  console.log(query);
  const result = await worker.db.query(query);
  console.log(result);
  return result;

}

