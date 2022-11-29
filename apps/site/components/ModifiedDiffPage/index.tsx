import React, { useEffect, useState } from "react";
import { getDisplayName, getIconSrc } from "../../lib/utils";

import s from "./styles.module.scss";
import BungieImage from "../BungieImage";
import { GenericDefinition } from "@destiny-definitions/common";
import JSONDiff from "../JSONDiff";

export interface ModifiedDiffPageProps {
  hash: string;
  definition: GenericDefinition | null;
  previousDefinition: GenericDefinition | null;
}

const ModifiedDiffPage: React.FC<ModifiedDiffPageProps> = ({
  hash,
  definition,
  previousDefinition,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const header = (
    <h2>
      {definition ? (
        <>
          <BungieImage
            className={s.icon}
            src={getIconSrc(definition)}
            alt="Icon"
          />
          "{getDisplayName(definition)}"
        </>
      ) : (
        hash
      )}{" "}
      diff
    </h2>
  );

  if (!isClient) {
    return (
      <div className={s.root}>
        {header}{" "}
        <p>
          <em>Loading...</em>
        </p>
      </div>
    );
  }

  return (
    <div className={s.root}>
      {header}

      <JSONDiff newObject={definition} oldObject={previousDefinition} />
    </div>
  );
};

export default ModifiedDiffPage;
