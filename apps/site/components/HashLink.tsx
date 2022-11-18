import React from "react";

import commonStyles from "../styles/common.module.scss";
import { friendlyDiffName } from "../lib/utils";
import { DefinitionTableDiff } from "@destiny-definitions/common";

interface HashLinkProps {
  hash: number | undefined;
  tableName: string;
}

export default function HashLink({ hash, tableName }: HashLinkProps) {
  if (hash === undefined) {
    return <>hash</>;
  }

  return (
    <a
      className={commonStyles.link}
      id={`hash_${hash}`}
      target="_blank"
      rel="noreferrer"
      href={`https://data.destinysets.com/i/${friendlyDiffName(
        tableName,
        false
      )}:${hash}`}
    >
      {hash}
    </a>
  );
}

function diffContainsHash(diff: DefinitionTableDiff | undefined, hash: number) {
  return Object.values(diff || {}).some((v) => v.includes(hash));
}

export const DiffHashLink: React.FC<
  HashLinkProps & { children: React.ReactNode }
> = ({ children }) => {
  return <>{children}</>;
};
