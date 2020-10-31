import React from "react";
import { getDisplayName, getIconSrc } from "../../lib/utils";
import { ModifiedDeepDiffEntry, AnyDefinition, DiffType } from "../../types";
import JSONTree from "react-json-tree";
import { Theme } from "react-base16-styling";

import s from "./styles.module.scss";
import BungieImage from "../BungieImage";
import { cloneDeepWith, mergeWith } from "lodash";

interface ModifiedDiffProps {
  hash: string;
  diffForHash: ModifiedDeepDiffEntry | undefined;
  definition: AnyDefinition;
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
  diffForHash,
  definition,
}) => {
  let oldDef: Record<string, any> = {};
  let newDef: Record<string, any> = {};

  const newDefProps = [];
  const oldDefProps = [];

  if (diffForHash) {
    for (const diffItem of diffForHash.diff) {
      if (!diffItem.path) {
        continue;
      }

      if (diffItem.kind === "A") {
        newDefProps.push({
          path: diffItem.path,
          value: [],
        });

        oldDefProps.push({
          path: diffItem.path,
          value: [],
        });

        if (diffItem.item.kind === "N") {
          newDefProps.push({
            path: [...diffItem.path, diffItem.index],
            value: diffItem.item.rhs,
          });
        }

        if (diffItem.item.kind === "D") {
          oldDefProps.push({
            path: [...diffItem.path, diffItem.index],
            value: diffItem.item.lhs,
          });
        }
      }

      if (diffItem.kind === "E" || diffItem.kind === "N") {
        newDefProps.push({
          path: diffItem.path,
          value: diffItem.rhs,
        });
      }

      if (diffItem.kind === "E" || diffItem.kind === "D") {
        oldDefProps.push({
          path: diffItem.path,
          value: diffItem.lhs,
        });
      }
    }
  }

  for (const iterator of newDefProps) {
    set(newDef, iterator.path, iterator.value);
  }

  for (const iterator of oldDefProps) {
    set(oldDef, iterator.path, iterator.value);
  }

  function diffForJsonPath(_keyPath: string[]) {
    const keyPath = _keyPath.slice(0, _keyPath.length - 1).reverse();

    while (keyPath.length) {
      const diff = diffForHash?.diff.find((diff) =>
        arrayShallowEquals(keyPath, diff.path || [])
      );

      if (diff) {
        return diff;
      }

      keyPath.pop();
    }
  }

  function applyStyle(
    styleFn: (
      diff: DiffType,
      type: string,
      _keyPath: string[]
    ) => Record<string, React.CSSProperties | undefined> | undefined,
    styleKey: string,
    additionalStyles?: React.CSSProperties
  ) {
    return (
      { style }: any,
      _type: string | string[],
      _keyPath: string[] | string
    ) => {
      // The arguments are sometimes in a different order. wtf
      const type = (Array.isArray(_type) ? _keyPath : _type) as string;
      const keyPath = (Array.isArray(_keyPath) ? _keyPath : _type) as string[];

      const diff = diffForJsonPath(keyPath);
      const customStyles = (diff && styleFn(diff, type, keyPath)) ?? {};
      const thisCustomStyles = customStyles?.[styleKey] ?? {};

      return {
        style: {
          ...style,
          ...(additionalStyles ?? {}),
          ...thisCustomStyles,
        },
      };
    };
  }

  function treeStyles(
    styleFn: (
      diff: DiffType,
      type: string,
      _keyPath: string[]
    ) => Record<string, React.CSSProperties | undefined> | undefined
  ): Theme {
    return {
      tree: {
        backgroundColor: "transparent",
        fontFamily: "monospace",
        color: "white",
      },

      arrowSign: {
        color: "inherit",
      },

      nestedNodeLabel: applyStyle(styleFn, "nestedNodeLabel", {
        color: "inherit",
      }),

      valueLabel: applyStyle(styleFn, "valueLabel", {
        color: "inherit",
        display: "inline-block",
        marginRight: 0,
        paddingRight: "0.5em",
      }),

      valueText: applyStyle(styleFn, "valueText", {
        color: "inherit",
        display: "inline-block",
        textIndent: 0,
      }),

      value: applyStyle(styleFn, "value", {
        textIndent: 0,
        paddingLeft: "1.125em",
      }),
    };
  }

  return (
    <div className={s.root}>
      <h1>
        {definition ? (
          <>
            <BungieImage className={s.icon} src={getIconSrc(definition)} />"
            {getDisplayName(definition)}"
          </>
        ) : (
          hash
        )}{" "}
        diff
      </h1>

      <p>Showing only changed properties</p>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: "1 1 100%" }}>
          <h2>Old</h2>
          <JSONTree
            data={oldDef}
            shouldExpandNode={() => true}
            theme={treeStyles(oldSideStyles)}
            collectionLimit={9999999}
          />
        </div>

        <div style={{ flex: "1 1 100%" }}>
          <h2>New</h2>
          <JSONTree
            data={newDef}
            shouldExpandNode={() => true}
            theme={treeStyles(newSideStyles)}
            collectionLimit={9999999}
          />
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h2>Diff</h2>
      <pre>{JSON.stringify(diffForHash, null, 2)}</pre>
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
    // console.log({ pathKey, currentObj });
  }

  currentObj[pathList[len - 1]] = value;

  // console.log("last", { pathKey: pathList[len - 1], currentObj });

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
