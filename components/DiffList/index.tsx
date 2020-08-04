import {
  AnyDefinitionTable,
  AnyDefinition,
  BareDestinyDefinition,
} from "../../types";
import FallbackDiffList from "./Fallback";
import ObjectiveDiffList from "./Objective";

interface DiffListProps {
  name: string;
  hashes: number[];
  definitions: AnyDefinitionTable;
}

function getDisplayName(def: AnyDefinition & BareDestinyDefinition) {
  return def?.displayProperties?.name;
}

function ForDefinitionType({ name, hashes, definitions }: DiffListProps) {
  const zeroth = hashes[0];
  const def = definitions[zeroth];

  switch (def?.__type) {
    case "DestinyObjectiveDefinition":
      return <ObjectiveDiffList hashes={hashes} definitions={definitions} />;
    default:
      return <FallbackDiffList hashes={hashes} definitions={definitions} />;
  }
}

export default function DiffList({ name, hashes, definitions }: DiffListProps) {
  if (hashes.length == 0) {
    return null;
  }

  return (
    <div>
      <h3>{name}</h3>

      <ForDefinitionType
        name={name}
        hashes={hashes}
        definitions={definitions}
      />
    </div>
  );
}
