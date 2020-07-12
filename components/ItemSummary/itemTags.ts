import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

type ItemDefinition = DestinyInventoryItemDefinition & {
  __type: "DestinyInventoryItemDefinition";
};

const DAMAGE_TYPE_NAMES: { [k: string]: string } = {
  [1]: "Kinetic",
  [2]: "Arc",
  [3]: "Solar",
  [4]: "Void",
  [5]: "Raid???",
};

const BUCKET_NAMES: { [k: string]: string } = {
  14239492: "Chest Armor",
  18606351: "Shaders",
  20886954: "Leg Armor",
  138197802: "General",
  215593132: "Lost Items",
  284967655: "Ships",
  375726501: "Engrams",
  953998645: "Power Weapons",
  1107761855: "Emotes",
  1269569095: "Auras",
  1345459588: "Quests",
  1367666825: "Special Orders",
  1469714392: "Consumables",
  1498876634: "Kinetic Weapons",
  1506418338: "Seasonal Artifact",
  1585787867: "Class Armor",
  2025709351: "Vehicle",
  2465295065: "Energy Weapons",
  2689798304: "Upgrade Point",
  2689798305: "Strange Coin",
  2689798308: "Glimmer",
  2689798309: "Legendary Shards",
  2689798310: "Silver",
  2689798311: "Bright Dust",
  2973005342: "Shaders",
  3054419239: "Emotes",
  3161908920: "Messages",
  3284755031: "Subclass",
  3313201758: "Modifications",
  3350918817: "Wrapped Items",
  3448274439: "Helmet",
  3551918588: "Gauntlets",
  3683254069: "Finishers",
  3865314626: "Materials",
  4023194814: "Ghost",
  4274335291: "Emblems",
  4292445962: "Clan Banners",
};

const grantDummy = (item: DestinyInventoryItemDefinition) =>
  item.itemCategoryHashes?.includes(3109687656) ? "Dummy" : null;

const grantDamageTypes = (item: DestinyInventoryItemDefinition) =>
  (item.damageTypes || []).map((v) => DAMAGE_TYPE_NAMES[v.toString()]);

const grantClassifiedBucket = (item: DestinyInventoryItemDefinition) => {
  const bucketName =
    item.redacted && item.inventory.bucketTypeHash
      ? BUCKET_NAMES[item.inventory.bucketTypeHash]
      : null;

  return bucketName ? `Maybe: ${bucketName}` : null;
};

const TAG_FNS = [grantDummy, grantDamageTypes, grantClassifiedBucket];

export default function getItemTags(def: DestinyInventoryItemDefinition) {
  return TAG_FNS.flatMap((fn) => fn(def)).filter(Boolean);
}
