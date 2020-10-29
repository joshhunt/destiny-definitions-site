import React from "react";
import { BareDestinyDefinition } from "../../types";
import BungieImage from "../BungieImage";

import s from "./styles.module.scss";

interface InlineChildProps {
  definition: BareDestinyDefinition | undefined;
}

const InlineChild: React.FC<InlineChildProps> = ({ definition }) => {
  if (!definition) {
    return null;
  }

  const icon = definition.displayProperties?.icon;

  return (
    <span>
      {icon && <BungieImage className={s.icon} src={icon} />}
      {definition.displayProperties?.name || <em>No name</em>}
    </span>
  );
};

export default InlineChild;
