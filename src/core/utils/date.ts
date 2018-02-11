import * as luxon from 'luxon';

export function getDate(time: number, format: luxon.DateTimeFormatOptions = luxon.DateTime.DATETIME_MED) {
  const dt = luxon.DateTime.fromMillis(time);

  return dt.toLocaleString(format);
}