const axios = require("axios");
const asyncLib = require("async");

interface CacheEntry {
  id: string;
  tableName: string;
  url: string;
}

async function main() {
  let { data: versionsIndex } = await axios.get(
    "https://destiny-definitions.s3-eu-west-1.amazonaws.com/index.json"
  );
  versionsIndex = versionsIndex.reverse().slice(0, 5);

  const urls: CacheEntry[] = [];

  for (const { id } of versionsIndex) {
    const resp = await axios.get(
      `https://destiny-definitions.s3-eu-west-1.amazonaws.com/versions/${id}/diff.json`
    );

    const data: Record<
      string,
      {
        added: number[];
        unclassified: number[];
        removed: number[];
        reclassified: number[];
      }
    > = resp.data;

    console.log("-------");
    // console.log(data);

    const tables = Object.entries(data)
      .filter((s) => Object.values(s[1]).some((v) => v.length))
      .map((v) => v[0]);

    console.log(tables);

    for (const tableName of tables) {
      urls.push({
        url: `http://localhost:81/version/${id}/${tableName}`,
        id,
        tableName,
      });
    }
  }

  console.log(urls);
  asyncLib.eachLimit(urls, 2, ({ url, id, tableName }: CacheEntry, cb: any) => {
    console.log("requesting", url, cb);
    axios
      .get(url)
      .then((resp: any) => {
        console.log("SUCCESS", id, tableName, resp?.status, resp?.statusText);
        cb();
      })
      .catch((err: any) => {
        if (err.response) {
          console.log(
            "ERROR",
            id,
            tableName,
            err.response?.status,
            err.response?.statusText
          );
        } else {
          console.log("ERROR", id, tableName, err.toString());
        }
      });
  });
}

main().catch((err) => {
  console.error("there was an error in main");
  console.error(err);
  process.exit(1);
});

export {};
