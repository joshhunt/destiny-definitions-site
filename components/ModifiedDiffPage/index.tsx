import React, { useMemo } from "react";
import { getDisplayName, getIconSrc } from "../../lib/utils";
import { ModifiedDeepDiffEntry, AnyDefinition, DiffType } from "../../types";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

import s from "./styles.module.scss";
import BungieImage from "../BungieImage";

interface ModifiedDiffProps {
  hash: string;
  diffForHash: ModifiedDeepDiffEntry | undefined;
  definition: AnyDefinition | null;
  previousDefinition: AnyDefinition | null;
}

const COLORS = {
  ADDED: "#66bb6a",
  CHANGE_NEW: "#ffca28",
  REMOVED: "#ef5350",
  CHANGE_OLD: "#e65100",
};

const newSideStyles = (diff: DiffType, type: string, _keyPath: string[]) => {
  if (diff.kind === "N") {
    return {
      valueLabel: {
        borderBottom: "2px solid currentColor",
        color: COLORS.ADDED,
      },
      valueText: {
        borderBottom: "2px solid currentColor",
        color: COLORS.ADDED,
      },
      nestedNodeLabel: {
        borderBottom: "2px solid currentColor",
        color: COLORS.ADDED,
      },
    };
  }

  if (diff.kind === "E") {
    return {
      valueText: {
        borderBottom: "2px solid currentColor",
        color: COLORS.CHANGE_NEW,
      },
    };
  }
};

const oldSideStyles = (diff: DiffType, type: string, _keyPath: string[]) => {
  if (diff.kind === "E") {
    return {
      valueText: {
        borderBottom: "2px solid currentColor",
        color: COLORS.CHANGE_OLD,
      },
    };
  }

  if (diff.kind === "D") {
    return {
      valueText: {
        borderBottom: "2px solid currentColor",
        color: COLORS.REMOVED,
      },
    };
  }
};

const ModifiedDiffPage: React.FC<ModifiedDiffProps> = ({
  hash,
  definition,
  previousDefinition,
}) => {
  if (!hash) {
    return <h1>Page is loading...</h1>;
  }

  const oldDef = useMemo(() => {
    const d = { ...previousDefinition } as any;
    d.__type = undefined;
    return JSON.stringify(d, null, 2);
  }, [previousDefinition]);

  const newDef = useMemo(() => {
    const d = { ...definition } as any;
    d.__type = undefined;
    return JSON.stringify(d, null, 2);
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
          ({
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
          } as unknown) as any
        }
      />
    </div>
  );
};

export default ModifiedDiffPage;

function set(obj: Record<string, any>, pathList: string[], value: any) {
  // console.group("Setting", pathList, "to value", value);
  let currentObj = obj;
  const len = pathList.length;

  for (const pathKey of pathList.slice(0, pathList.length - 1)) {
    if (!currentObj[pathKey]) currentObj[pathKey] = {};
    currentObj = currentObj[pathKey];
  }

  currentObj[pathList[len - 1]] = value;

  console.groupEnd();
}

const theme = {
  scheme: "monokai",
  author: "wimer hazenberg (http://www.monokai.nl)",
  base00: "#272822",
  base01: "#383830",
  base02: "#49483e",
  base03: "#75715e",
  base04: "#a59f85",
  base05: "#f8f8f2",
  base06: "#f5f4f1",
  base07: "#f9f8f5",
  base08: "#f92672",
  base09: "#fd971f",
  base0A: "#f4bf75",
  base0B: "#a6e22e",
  base0C: "#a1efe4",
  base0D: "#66d9ef",
  base0E: "#ae81ff",
  base0F: "#cc6633",
};

function arrayShallowEquals(arr1: any[], arr2: any[]) {
  return (
    arr1.length === arr2.length &&
    arr1.every((value, index) => value === arr2[index])
  );
}
