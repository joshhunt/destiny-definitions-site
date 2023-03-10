import {
  useFloating,
  offset,
  shift,
  flip,
  autoUpdate,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
} from "@floating-ui/react";
import React, { useState } from "react";
import s from "./styles.module.scss";

interface RedactedTextProps {
  text: string | undefined;
}

const RedactedText: React.FC<RedactedTextProps> = ({ text }) => {
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

  if (text === "$$obfuscated") {
    return (
      <>
        <span
          className={s.redacted}
          ref={refs.setReference}
          {...getReferenceProps()}
        >
          {"[Redacted]"}
        </span>
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
            <div className={s.tooltip}>Available after the raid starts</div>
          </div>
        )}
      </>
    );
  }

  return <span>{text}</span>;
};

export default RedactedText;
