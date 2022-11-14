import { AllDestinyManifestComponentsTagged } from "../../types";

import s from "./styles.module.scss";

interface ObjectiveTableProps {
  definitions: AllDestinyManifestComponentsTagged["DestinyObjectiveDefinition"];
  hashes: number[];
}

const ObjectiveTable: React.FC<ObjectiveTableProps> = ({
  hashes,
  definitions,
}) => {
  return (
    <table className={s.table} cellPadding={0} cellSpacing={0}>
      <tbody>
        {hashes.map((hash) => {
          const def = definitions[hash];

          if (!def) {
            return (
              <tr key={hash}>
                <td colSpan={2}>Unknown objective {hash}</td>
              </tr>
            );
          }

          return (
            <tr key={hash}>
              <td className={s.objective}>
                {def.progressDescription ||
                  def.displayProperties.name ||
                  "Complete"}
              </td>
              <td className={s.completion}>{def.completionValue}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ObjectiveTable;
