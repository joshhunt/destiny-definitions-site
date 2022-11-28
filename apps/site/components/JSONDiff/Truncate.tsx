import { useMemo, useState } from "react";
import styles from "./truncate.styles.module.scss";

export enum TruncationDirection {
  Leading, // Truncate at the leading direction - show only the last n lines
  Mid,
  Trailing,
}

interface TruncationProps {
  direction: TruncationDirection;
  text: string;
}

const TRUNCATION_AMOUNT = 3;

function truncateBeginning(str: string, amount: number = TRUNCATION_AMOUNT) {
  let foundIndex = 0;
  let indexCounter = 0;

  for (let index = str.length - 1; index >= 0; index--) {
    const letter = str[index];
    if (letter === "\n") {
      indexCounter += 1;
    }

    if (indexCounter > amount) {
      foundIndex = index + 1;
      break;
    }
  }

  return str.slice(foundIndex);
}

function countLines(text: string) {
  return (text.match(/\n/g) ?? []).length;
}

function truncateEnd(str: string, amount: number = TRUNCATION_AMOUNT) {
  let foundIndex = 0;
  let indexCounter = 0;

  for (let index = 0; index < str.length; index++) {
    const letter = str[index];
    if (letter === "\n") {
      indexCounter += 1;
    }

    if (indexCounter >= amount) {
      foundIndex = index;
      break;
    }
  }

  return str.slice(0, foundIndex);
}

export default function Truncate({ direction: dir, text }: TruncationProps) {
  const [toggledFull, setToggledFull] = useState(false);

  const lineCount = useMemo(() => {
    return (text.match(/\n/g) ?? []).length;
  }, [text]);

  const truncationLimit =
    dir === TruncationDirection.Mid
      ? TRUNCATION_AMOUNT * 2 + 1
      : TRUNCATION_AMOUNT + 1;

  const showFull = toggledFull || lineCount < truncationLimit;

  const lastThreeLines = useMemo(() => {
    if (showFull) return undefined;
    // if (dir !== TruncationDirection.Trailing) return undefined;
    return truncateBeginning(text, TRUNCATION_AMOUNT);
  }, [showFull, text]);

  const firstThreeLines = useMemo(() => {
    if (showFull) return undefined;
    // if (dir !== TruncationDirection.Leading) return undefined;
    return truncateEnd(text, TRUNCATION_AMOUNT);
  }, [showFull, text]);

  const truncatedLineCount = useMemo(() => {
    const lastThreeLinesCount = lastThreeLines ? countLines(lastThreeLines) : 0;
    const firstThreeLinesCount = firstThreeLines
      ? countLines(firstThreeLines)
      : 0;
    return lineCount - lastThreeLinesCount - firstThreeLinesCount;
  }, []);

  if (showFull) {
    return <>{text}</>;
  }

  const toggleButton = (
    <button className={styles.button} onClick={() => setToggledFull(true)}>
      Expand {truncatedLineCount} lines...
    </button>
  );

  if (dir === TruncationDirection.Leading) {
    return (
      <span>
        {toggleButton}
        <br />
        {lastThreeLines}
      </span>
    );
  }

  if (dir === TruncationDirection.Trailing) {
    return (
      <span>
        {firstThreeLines}
        <br />
        {toggleButton}
      </span>
    );
  }

  if (dir === TruncationDirection.Mid) {
    return (
      <span>
        {firstThreeLines}
        <br />
        {toggleButton}
        <br />
        {lastThreeLines}
      </span>
    );
  }

  return <></>;
}
