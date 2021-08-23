const axios = require("axios");
const asyncLib = require("async");

interface CacheEntry {
  id: string;
  tableName: string;
  url: string;
}

async function main() {
  const { data: versionsIndex } = await axios.get(
    "https://destiny-definitions.s3-eu-west-1.amazonaws.com/index.json"
  );
  versionsIndex.reverse();

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

    for (const tableName of tables) {
      urls.push({
        url: `https://localhost:81/version/${id}/${tableName}`,
        id,
        tableName,
      });
    }
  }

  asyncLib.eachLimit(
    urls,
    1,
    asyncLib.asyncify(async ({ url, id, tableName }: CacheEntry) => {
      try {
        const resp = await axios.get(url);
        console.log(id, tableName, resp.status, resp.statusText);
      } catch (err) {
        console.log(
          id,
          tableName,
          err.response.status,
          err.response.statusText
        );
      }
    })
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

export {};
