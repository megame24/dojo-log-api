export type TimeMetric = "d" | "h" | "m";

export interface DateService {
  timezone: string | undefined;
  days: string[];
  months: string[];
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
  getStartOfYear: (year: string) => Date;
  getEndOfYear: (year: string) => Date;
  getDateFromDayOfYear: (year: string, dayOfYear: number) => Date;
  getDay: (date: Date | string, convertToLocalTime: boolean) => number;
  getMonth: (date: Date | string, convertToLocalTime: boolean) => number;
}

export class DateServiceImpl implements DateService {
  timezone: string | undefined;
  set setTimezone(value: string) {
    if (!this.timezone || this.timezone !== value) this.timezone = value;
  }

  days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

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

  getStartOfYear(year: string): Date {
    return this.dayjs()
      .tz(this.timezone)
      .set("year", year)
      .startOf("year")
      .toISOString();
  }

  getEndOfYear(year: string): Date {
    return this.dayjs()
      .tz(this.timezone)
      .set("year", year)
      .endOf("year")
      .toISOString();
  }

  getDateFromDayOfYear(year: string, dayOfYear: number): Date {
    return this.dayjs()
      .tz(this.timezone)
      .set("year", year)
      .dayOfYear(dayOfYear);
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

  getDay(date: Date | string, convertToLocalTime: boolean): number {
    const validDate: any = this.convertDateStringToDate(
      date,
      convertToLocalTime
    );
    return validDate.get("day");
  }

  getMonth(date: Date | string, convertToLocalTime: boolean): number {
    const validDate: any = this.convertDateStringToDate(
      date,
      convertToLocalTime
    );
    return validDate.get("month");
  }

  convertDateStringToDate(
    date: Date | string,
    convertToLocalTime = false
  ): Date {
    if (convertToLocalTime) return this.dayjs(date).tz(this.timezone);
    return this.dayjs(date);
  }
}
