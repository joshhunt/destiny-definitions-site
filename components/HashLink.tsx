import React from "react";

import commonStyles from "../styles/common.module.scss";
import { friendlyDiffName } from "../lib/utils";
import { useDiffData } from "./diffDataContext";
import { DefinitionDiff } from "../types";
import Link from "next/link";

interface HashLinkProps {
  hash: number;
  definitionName: string;
}

export default function HashLink({ hash, definitionName }: HashLinkProps) {
  return (
    <a
      className={commonStyles.link}
      id={`hash_${hash}`}
      target="_blank"
      rel="noreferrer"
      href={`https://data.destinysets.com/i/${friendlyDiffName(
        definitionName,
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

export const DiffHashLink: React.FC<HashLinkProps> = ({
  hash,
  definitionName,
  children,
}) => {
  const {
    versionId,
    versionDiff,
    definitionName: currentDefName,
  } = useDiffData();
  const isInDiff =
    versionDiff && diffContainsHash(versionDiff[definitionName], hash);

  if (!isInDiff) {
    return <>{children}</>;
  }

  if (currentDefName === definitionName) {
    return (
      <a href={`#hash_${hash}`} className={commonStyles.link}>
        {children}
      </a>
    );
  }

  return (
    <Link href={`/version/${versionId}/${definitionName}#hash_${hash}`}>
      <a className={commonStyles.link}>{children}</a>
    </Link>
  );
};
