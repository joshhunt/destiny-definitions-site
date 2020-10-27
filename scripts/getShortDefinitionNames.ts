const axios = require("axios");
const fs = require("fs-extra");

const CUSTOM_MAPPINGS = {
  DestinyRecordDefinition: "Triumphs",
};

async function main() {
  const { data: openApi } = await axios.get(
    "https://raw.githubusercontent.com/Bungie-net/api/master/openapi-2.json"
  );
  const mobileDefs = Object.entries(openApi.definitions).filter(
    ([name, schema]: any) => {
      return schema["x-mobile-manifest-name"];
    }
  );

  const mapping = mobileDefs.reduce<Record<string, string>>(
    (acc, [name, schema]: any) => {
      const matches = name.match(/Destiny\w+Definition/);
      const tableName = matches && matches[0];

      if (tableName) {
        return {
          [tableName]: schema["x-mobile-manifest-name"],
          ...acc,
        };
      }

      return acc;
    },
    CUSTOM_MAPPINGS
  );

  console.log(mapping);

  await fs.writeJson("./lib/tableNameMappings.json", mapping, { spaces: 2 });
}

main().catch(console.error);

export {};
