import React from "react";

import commonStyles from "../styles/common.module.scss";
import { friendlyDiffName } from "../lib/utils";
import { useDiffData } from "./diffDataContext";
import Link from "next/link";

interface HashLinkProps {
  hash: number;
  tableName: string;
}

export default function HashLink({ hash, tableName }: HashLinkProps) {
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

function diffContainsHash(diff: DefinitionDiff | undefined, hash: number) {
  return Object.values(diff || {}).some((v) => v.includes(hash));
}

export const DiffHashLink: React.FC<
  HashLinkProps & { children: React.ReactNode }
> = ({ hash, tableName, children }) => {
  const { versionId, versionDiff, tableName: currentDefName } = useDiffData();
  const isInDiff =
    versionDiff && diffContainsHash(versionDiff[tableName], hash);

  if (!isInDiff) {
    return <>{children}</>;
  }

  if (currentDefName === tableName) {
    return (
      <a href={`#hash_${hash}`} className={commonStyles.link}>
        {children}
      </a>
    );
  }

  return (
    <Link
      className={commonStyles.link}
      href={`/version/${versionId}/${tableName}#hash_${hash}`}
    >
      {children}
    </Link>
  );
};
