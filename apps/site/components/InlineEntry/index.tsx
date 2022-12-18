import React from "react";
import { friendlyDiffName } from "../../lib/utils";
import { BareDestinyDefinition } from "../../types";
import BungieImage from "../BungieImage";
import commonStyles from "../../styles/common.module.scss";
import cx from "classnames";

import s from "./styles.module.scss";

interface InlineChildProps {
  definition: BareDestinyDefinition | undefined;
}

const InlineChild: React.FC<InlineChildProps> = ({ definition }) => {
  if (!definition) {
    return null;
  }

  const icon = definition.displayProperties?.icon;
  const definitionName = definition.__type;

  const kids = (
    <span className={cx(s.content, commonStyles.invisibleLink)}>
      {icon && <BungieImage className={s.icon} src={icon} />}
      {definition.displayProperties?.name || <em>No name</em>}
      {definitionName && <div className={s.tooltip}>{definitionName}</div>}
    </span>
  );

  if (definitionName) {
    return (
      <a
        className={commonStyles.invisibleLink}
        target="_blank"
        rel="noreferrer"
        href={`https://data.destinysets.com/i/${friendlyDiffName(
          definitionName,
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
