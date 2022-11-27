import React, { useEffect, useMemo, useState } from "react";
import { getDisplayName, getIconSrc } from "../../lib/utils";
/// @ts-ignore
import { parseDiff, Diff, Hunk } from "react-diff-view";
/// @ts-ignore
import { diffLines, formatLines } from "unidiff";
import "react-diff-view/style/index.css";

import s from "./styles.module.scss";
import BungieImage from "../BungieImage";
import { GenericDefinition } from "@destiny-definitions/common";

const EMPTY_HUNKS = [];

export interface ModifiedDiffPageProps {
  hash: string;
  definition: GenericDefinition | null;
  previousDefinition: GenericDefinition | null;
}

const log = (msg: string) => {
  console.log(msg);
  performance.mark(msg);
};

const ModifiedDiffPage: React.FC<ModifiedDiffPageProps> = ({
  hash,
  definition,
  previousDefinition,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  // useEffect(() => {
  //   log("Setting isClient to true");
  //   setIsClient(true);
  // }, []);

  const diff = useMemo(() => {
    if (!isClient) return undefined;

    log("making old json");
    const oldJSON = JSON.stringify(previousDefinition, null, 2);

    log("making new json");
    const newJSON = JSON.stringify(definition, null, 2);

    log("diffLines");
    const lineDiff = diffLines(oldJSON, newJSON);

    log("formatLines");
    const diffText = formatLines(lineDiff, {
      context: 3,
    });

    log("parseDiff");
    const [diff] = parseDiff(diffText, { nearbySequences: "zip" });

    return diff;
  }, [isClient, previousDefinition, definition]);

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

  if (!isClient || !diff) {
    log("Returning Loading view");
    return (
      <div className={s.root}>
        {header}{" "}
        <p>
          <em>Loading...</em>
        </p>
      </div>
    );
  }

  log("Returning diff view");
  return (
    <div className={s.root}>
      {header}

      <button onClick={() => setShowDiff((v) => !v)}>Show diff</button>

      {showDiff ? (
        <div style={{ color: "black", background: "white" }}>
          <Diff
            viewType="split"
            diffType={diff.type}
            hunks={diff.hunks || EMPTY_HUNKS}
          >
            {(hunks) =>
              hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
            }
          </Diff>
        </div>
      ) : (
        <p>pretend this is diff component</p>
      )}
    </div>
  );
};

export default ModifiedDiffPage;
