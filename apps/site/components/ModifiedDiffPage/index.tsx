import React, { useMemo } from "react";
import { getDisplayName, getIconSrc } from "../../lib/utils";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

import s from "./styles.module.scss";
import BungieImage from "../BungieImage";
import { GenericDefinition } from "@destiny-definitions/common";

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
  if (!hash) {
    return <h1>Page is loading...</h1>;
  }

  const oldDef = useMemo(() => {
    return JSON.stringify(previousDefinition, null, 2);
  }, [previousDefinition]);

  const newDef = useMemo(() => {
    return JSON.stringify(definition, null, 2);
  }, [definition]);

  return (
    <div className={s.root}>
      <h1>
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
      </h1>

      <ReactDiffViewer
        leftTitle="Before"
        rightTitle="Now"
        oldValue={oldDef}
        newValue={newDef}
        splitView={true}
        compareMethod={DiffMethod.WORDS}
        useDarkTheme={true}
        styles={
          {
            variables: {
              dark: {
                diffViewerTitleColor: "white",
              },
            },
            codeFold: {
              a: {
                textDecoration: "none !important",
                "&:hover": {
                  textDecoration: "underline !important",
                },
              },
            },
          } as unknown as any
        }
      />
    </div>
  );
};

export default ModifiedDiffPage;
