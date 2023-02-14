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

export function ensureDate(date: Date | string): Date {
  if (typeof date === "string") {
    return new Date(date);
  }

  return date;
}

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

export function formatDateShort(date: Date | string, locale?: string): string {
  return dateTimeFormatter(date, locale, DATE_FORMAT_SHORT);
}

export function formatTime(date: Date | string, locale?: string): string {
  return dateTimeFormatter(date, locale, TIME_FORMAT);
}

export function formatDateTime(date: Date | string, locale?: string): string {
  return dateTimeFormatter(date, locale, DATE_TIME_FORMAT);
}
