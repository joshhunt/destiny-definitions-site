import { FormatDateTime } from "../DateTimeFormatters";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import useIsClient from "../../lib/useIsClient";
import { useMemo } from "react";
import React from "react";

const SARCASM = [
  "reluctantly",
  "enthusiasticly",
  "mediocrely",
  "sometimes",
  "occasionally",
];

function Footer({
  buildDate: buildDateString,
}: {
  buildDate: undefined | string;
}) {
  const isClient = useIsClient();
  const buildDate = useMemo(
    () => (buildDateString && new Date(buildDateString)) || undefined,
    []
  );
  const sarcasm = useMemo(() => {
    const index =
      Math.round((buildDate?.getTime() ?? 0) / 1000) % SARCASM.length;
    return SARCASM[index];
  }, []);

  return (
    <div style={{ margin: 32, fontSize: 14, opacity: 0.75 }}>
      {buildDate && (
        <p>
          Page built <FormatDateTime date={buildDate} />
          {isClient &&
            ` (${formatDistanceToNowStrict(buildDate, {
              addSuffix: true,
            })})`}
          . {isClient && "Client JS running."}
        </p>
      )}

      <p>
        Site maintained ({sarcasm}) by{" "}
        <a
          target="_blank"
          href="https://twitter.com/joshhunt"
          style={{ color: "inherit" }}
        >
          joshhunt
        </a>
        . No copyright intended.
      </p>
    </div>
  );
}

export default React.memo(Footer);

function randomPick<T>(array: Array<T>, seed: number): T {
  let m = array.length,
    t,
    i;

  while (m) {
    i = Math.floor(random(seed) * m--);

    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed;
  }

  return array[0];
}

function random(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
