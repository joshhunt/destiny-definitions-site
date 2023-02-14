import { useMemo } from "react";
import {
  ensureDate,
  formatDate,
  formatDateShort,
  formatDateTime,
  formatTime,
} from "../lib/formatDate";
import useIsClient from "../lib/useIsClient";

function useDate(date: Date | string) {
  return useMemo(() => ensureDate(date), []);
}

export function FormatDate({ date: _date }: { date: Date | string }) {
  const isClient = useIsClient();
  const date = useDate(_date);

  return <>{isClient ? formatDate(date) : date.toUTCString()}</>;
}

export function FormatDateShort({ date: _date }: { date: Date | string }) {
  const isClient = useIsClient();
  const date = useDate(_date);
  return <>{isClient ? formatDateShort(date) : date.toUTCString()}</>;
}

export function FormatTime({ date: _date }: { date: Date | string }) {
  const isClient = useIsClient();
  const date = useDate(_date);
  return <>{isClient ? formatTime(date) : date.toUTCString()}</>;
}

export function FormatDateTime({ date: _date }: { date: Date | string }) {
  const isClient = useIsClient();
  const date = useDate(_date);
  return <>{isClient ? formatDateTime(date) : date.toUTCString()}</>;
}
