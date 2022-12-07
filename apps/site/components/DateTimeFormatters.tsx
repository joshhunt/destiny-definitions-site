import {
  formatDate,
  formatDateFixedLocale,
  formatDateShort,
  formatDateShortFixedLocale,
  formatDateTime,
  formatDateTimeFixedLocale,
  formatTime,
  formatTimeFixedLocale,
} from "../lib/formatDate";
import useIsClient from "../lib/useIsClient";

export function FormatDate({ date }: { date: Date | string }) {
  const isClient = useIsClient();
  return <>{isClient ? formatDate(date) : formatDateFixedLocale(date)}</>;
}

export function FormatDateShort({ date }: { date: Date | string }) {
  const isClient = useIsClient();
  return (
    <>{isClient ? formatDateShort(date) : formatDateShortFixedLocale(date)}</>
  );
}

export function FormatTime({ date }: { date: Date | string }) {
  const isClient = useIsClient();
  return <>{isClient ? formatTime(date) : formatTimeFixedLocale(date)}</>;
}

export function FormatDateTime({ date }: { date: Date | string }) {
  const isClient = useIsClient();
  return (
    <>{isClient ? formatDateTime(date) : formatDateTimeFixedLocale(date)}</>
  );
}
