export const fixedLocale = "en-GB";

const DATE_FORMAT_LONG: Intl.DateTimeFormatOptions = { dateStyle: "full" };
const DATE_FORMAT_SHORT: Intl.DateTimeFormatOptions = { dateStyle: "medium" };
const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  hour12: true,
  hour: "numeric",
  minute: "numeric",
  timeZone: "GMT",
  timeZoneName: "shortOffset",
};
const DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  dateStyle: "full",
  timeStyle: "long",
  hour12: true,
};

function dateTimeFormatter(
  date: Date | string,
  locale: string | undefined,
  options: Intl.DateTimeFormatOptions
): string {
  if (typeof date === "string") {
    return dateTimeFormatter(new Date(date), locale, options);
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatDate(date: Date | string, locale?: string): string {
  return dateTimeFormatter(date, locale, DATE_FORMAT_LONG);
}

export function formatDateFixedLocale(date: Date | string) {
  return formatDate(date, fixedLocale);
}

export function formatDateShort(date: Date | string, locale?: string): string {
  return dateTimeFormatter(date, locale, DATE_FORMAT_SHORT);
}

export function formatDateShortFixedLocale(date: Date | string) {
  return formatDateShort(date, fixedLocale);
}

export function formatTime(date: Date | string, locale?: string): string {
  return dateTimeFormatter(date, locale, TIME_FORMAT);
}

export function formatTimeFixedLocale(date: Date | string) {
  return formatTime(date, fixedLocale);
}

export function formatDateTime(date: Date | string, locale?: string): string {
  return dateTimeFormatter(date, locale, DATE_TIME_FORMAT);
}

export function formatDateTimeFixedLocale(date: Date | string) {
  return formatDateTime(date, fixedLocale);
}
