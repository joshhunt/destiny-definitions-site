import {
  AnyDefinitionTable,
  AllDestinyManifestComponentsTagged,
} from "./types";

export function ensureDefinitionType(
  definitions: AnyDefinitionTable,
  type: keyof AllDestinyManifestComponentsTagged
) {
  if (Object.values(definitions).some((v) => v.__type !== type)) {
    throw new Error(`Definitions do not all contain ${type}`);
  }
}
