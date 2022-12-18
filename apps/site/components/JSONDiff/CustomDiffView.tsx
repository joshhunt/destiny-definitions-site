import {
  diff_match_patch,
  DIFF_INSERT,
  DIFF_DELETE,
  DIFF_EQUAL,
} from "diff-match-patch";
import { useMemo } from "react";
import Truncate, { TruncationDirection } from "./Truncate";

const CUSTOM_DIFF_TRUNCATION = 777;

interface JSONDiffProps {
  oldJSON: string;
  newJSON: string;
}

export default function CustomDiffView({ oldJSON, newJSON }: JSONDiffProps) {
  const diff = useMemo(() => {
    const dmp = new diff_match_patch();
    dmp.Diff_Timeout = 10;

    const diffs = diff_lineMode(dmp, oldJSON, newJSON);

    const summarizedDiff: [number, string | React.ReactNode][] = [];

    for (let index = 0; index < diffs.length; index++) {
      const [changeType, text] = diffs[index];

      if (changeType === DIFF_INSERT || changeType === DIFF_DELETE) {
        summarizedDiff.push([changeType, text]);
        continue;
      }

      let truncationDirection: TruncationDirection;

      if (index === 0) {
        truncationDirection = TruncationDirection.Leading;
      } else if (index === diffs.length - 1) {
        truncationDirection = TruncationDirection.Trailing;
      } else {
        truncationDirection = TruncationDirection.Mid;
      }

      summarizedDiff.push([
        changeType,
        <Truncate direction={truncationDirection} text={text} />,
      ]);
    }

    return summarizedDiff;
  }, [oldJSON, newJSON]);

  return (
    <div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
      {diff.map(([op, data], index) => {
        if (op === DIFF_INSERT) {
          return (
            <span key={index} style={{ background: "#27ae60c0" }}>
              {data}
            </span>
          );
        }

        if (op === DIFF_DELETE) {
          return (
            <span key={index} style={{ background: "#e74c3cc0" }}>
              {data}
            </span>
          );
        }

        if (op === CUSTOM_DIFF_TRUNCATION) {
          return (
            <span
              key={index}
              style={{ opacity: 0.75, background: "#FFFFFF51" }}
            >
              {data}
            </span>
          );
        }

        return <span key={index}>{data}</span>;
      })}
    </div>
  );
}

function diff_lineMode(dmp: diff_match_patch, text1: string, text2: string) {
  const a = dmp.diff_linesToChars_(text1, text2);
  const lineText1 = a.chars1;
  const lineText2 = a.chars2;
  const lineArray = a.lineArray;
  const diffs = dmp.diff_main(lineText1, lineText2, false);
  dmp.diff_charsToLines_(diffs, lineArray);
  return diffs;
}
