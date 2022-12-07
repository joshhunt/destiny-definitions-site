import React from "react";
import { friendlyTableName } from "../../lib/utils";
import BungieImage from "../BungieImage";
import commonStyles from "../../styles/common.module.scss";
import cx from "classnames";

import s from "./styles.module.scss";
import { GenericDefinition } from "@destiny-definitions/common";

interface InlineChildProps {
  definition: GenericDefinition | undefined;
  tableName?: string | undefined;
}

const InlineChild: React.FC<InlineChildProps> = ({ definition, tableName }) => {
  if (!definition) {
    return null;
  }

  const icon = definition.displayProperties?.icon;

  const kids = (
    <span className={cx(s.content, commonStyles.invisibleLink)}>
      {icon && <BungieImage className={s.icon} src={icon} />}
      {definition.displayProperties?.name || <em>No name</em>}
      {tableName && <div className={s.tooltip}>{tableName}</div>}
    </span>
  );

  if (tableName) {
    return (
      <a
        className={commonStyles.invisibleLink}
        target="_blank"
        rel="noreferrer"
        href={`https://data.destinysets.com/i/${friendlyTableName(
          tableName,
          false
        )}:${definition.hash}`}
      >
        {kids}
      </a>
    );
  }

  return <span>{kids}</span>;
};

export default InlineChild;
