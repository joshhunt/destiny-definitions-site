import { DestinyInventoryItemDefinition } from "@destiny-definitions/common";
import React, { useState } from "react";
import cx from "classnames";
import { getDescription, getIconSrc } from "../../../lib/utils";
import BungieImage from "../../BungieImage";
import s from "./styles.module.scss";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
} from "@floating-ui/react";
import PerkTooltip from "../PerkTooltip";

interface SmallPerkProps {
  perkItem: DestinyInventoryItemDefinition;
  enhancedPerkItem: DestinyInventoryItemDefinition | undefined;
}

const SmallPerk: React.FC<SmallPerkProps> = ({
  perkItem,
  enhancedPerkItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: "right",
  });

  const hover = useHover(context, { move: true });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <div
        className={s.smallPerk}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <BungieImage
          className={cx(
            s.smallPerkIcon,
            perkItem?.inventory?.tierType === 3 && s.enhancedPerkIcon
          )}
          src={getIconSrc(perkItem)}
        />
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          {...getFloatingProps()}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: "max-content",
            whiteSpace: "pre-line",
          }}
        >
          <PerkTooltip
            perkItem={perkItem}
            enhancedPerkItem={enhancedPerkItem}
          />
        </div>
      )}
    </>
  );
};

export default SmallPerk;
