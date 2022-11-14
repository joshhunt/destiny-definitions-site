import {
  AnyDefinitionTable,
  AllDestinyManifestComponentsTagged,
} from "./types";

export function ensureDefinitionType<T>(
  definitions: AnyDefinitionTable,
  type: keyof AllDestinyManifestComponentsTagged
) {
  if (Object.values(definitions).some((v) => v.__type !== type)) {
    throw new Error(`Definitions do not all contain ${type}`);
  }

  return definitions as unknown as T;
}
