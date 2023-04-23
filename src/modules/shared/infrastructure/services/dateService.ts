export type TimeMetric = "d" | "h" | "m";

export interface DateService {
  timezone: string | undefined;
  getDayOfYear: (date: Date) => number;
  getTimelessTimestamp: (date: Date, convertToLocalTime: boolean) => number;
  getTimelessDate: (date: Date | string) => Date;
  addTimeToDate: (
    date: Date,
    timeValue: number,
    timeMetric: TimeMetric
  ) => Date;
  convertDateStringToDate: (
    date: Date | string,
    convertToLocalTime: boolean
  ) => Date;
}

export class DateServiceImpl implements DateService {
  timezone: string | undefined;
  set setTimezone(value: string) {
    if (!this.timezone || this.timezone !== value) this.timezone = value;
  }

  constructor(private dayjs: any) {}

  getDayOfYear(date: Date | string): number {
    const validDate: any = this.convertDateStringToDate(date, true);
    const dayOfYear = validDate.dayOfYear();
    return dayOfYear;
  }

  getTimelessTimestamp(
    date: Date | string,
    convertToLocalTime: boolean
  ): number {
    const validDate: any = this.convertDateStringToDate(
      date,
      convertToLocalTime
    );
    return Date.UTC(
      validDate.get("year"),
      validDate.get("month"),
      validDate.get("date")
    );
  }

  getTimelessDate(date: Date | string): Date {
    // Do we want validDate in UTC?
    const validDate: any = this.convertDateStringToDate(date, true);
    return new Date(
      validDate.get("year"),
      validDate.get("month"),
      validDate.get("date")
    );
  }

  addTimeToDate(date: Date, timeValue: number, timeMetric: TimeMetric): Date {
    return this.dayjs(date).add(timeValue, timeMetric).format();
  }

  convertDateStringToDate(
    date: Date | string,
    convertToLocalTime = false
  ): Date {
    if (convertToLocalTime) return this.dayjs(date).tz(this.timezone);
    return this.dayjs(date);
  }
}
