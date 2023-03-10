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
  if (text === "$$obfuscated") {
    return (
      <>
        <span className={s.redacted}>
          <span className={s.redactedText}>{"[Redacted]"}</span>
          <span className={s.redactedExplainer}>
            {"[Available after the raid starts]"}
          </span>
        </span>
      </>
    );
  }

  return <span>{text}</span>;
};

export default RedactedText;
