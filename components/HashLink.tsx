import React from "react";

import commonStyles from "../styles/common.module.scss";
import { friendlyDiffName } from "../lib/utils";

export default function HashLink({
  hash,
  definitionName,
}: {
  hash: number;
  definitionName: string;
}) {
  return (
    <a
      className={commonStyles.link}
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
