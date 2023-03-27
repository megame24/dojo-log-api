export type TimeMetric = "d" | "h" | "m";

export interface DateService {
  timezone: string | undefined;
  getDayOfYear: (date: Date) => number;
  getDateInUTC: (date: Date) => number;
  getTimelessDate: (date: Date | string) => Date;
  addTimeToDate: (
    date: Date,
    timeValue: number,
    timeMetric: TimeMetric
  ) => Date;
  getStartOfCurrentWeek: () => Date;
  getEndOfCurrentWeek: () => Date;
  getStartOfCurrentYear: () => Date;
  getEndOfCurrentYear: () => Date;
  getStartOfCurrentMonth: () => Date;
  getEndOfCurrentMonth: () => Date;
  subtractTimeFromDate: (
    date: Date,
    timeValue: number,
    timeMetric: TimeMetric
  ) => Date;
  getEndOfDay: (date: Date) => Date;
  getTimelessDateInUTCTimeZone: (date: Date | string) => Date;
  getTimelessDateInLocalTimeZone: (date: Date | string) => Date;
}

export class DateServiceImpl implements DateService {
  timezone: string | undefined;
  set setTimezone(value: string) {
    if (!this.timezone || this.timezone !== value) this.timezone = value;
  }

  constructor(private dayjs: any) {}

  getDayOfYear(date: Date | string): number {
    const validDate: any = this.convertDateStringToDate(date);
    const dayOfYear = validDate.dayOfYear();
    return dayOfYear;
  }

  getDateInUTC(date: Date | string): number {
    const validDate: any = this.convertDateStringToDate(date);
    return Date.UTC(
      validDate.get("year"),
      validDate.get("month"),
      validDate.get("date")
    );
  }

  getTimelessDate(date: Date | string): Date {
    const validDate: any = this.convertDateStringToDate(date);
    return new Date(
      validDate.get("year"),
      validDate.get("month"),
      validDate.get("date")
    );
  }

  getTimelessDateInLocalTimeZone(date: Date | string): Date {
    const validDate: any = this.convertDateStringToDate(date);
    console.log(validDate, "*********8888888");
    return this.dayjs({
      year: validDate.get("year"),
      month: validDate.get("month"),
      date: validDate.get("date"),
    })
      .tz(this.timezone)
      .toDate();
  }

  getTimelessDateInUTCTimeZone(date: Date | string): Date {
    const validDate: any = this.convertDateStringToDate(date);
    const d = this.dayjs({
      year: validDate.get("year"),
      month: validDate.get("month"),
      date: validDate.get("date"),
    })
      .tz(this.timezone)
      .format();
    // console.log(validDate.get('year'), validDate.get('month'), validDate.get('date'), 'KKKKKKKKKKKK')
    console.log(
      new Date(2023, 2, 21).toString(),
      new Date(
        validDate.get("year"),
        validDate.get("month"),
        validDate.get("date")
      ),
      d,
      "KKKKKKKKKKKKKK"
    );
    return new Date(
      validDate.get("year"),
      validDate.get("month"),
      validDate.get("date")
    );
  }

  subtractTimeFromDate(
    date: Date,
    timeValue: number,
    timeMetric: TimeMetric
  ): Date {
    return this.dayjs(date).subtract(timeValue, timeMetric).format();
  }

  addTimeToDate(date: Date, timeValue: number, timeMetric: TimeMetric): Date {
    console.log(this.dayjs(date), "*********");
    return this.dayjs(date).add(timeValue, timeMetric).format();
  }

  getStartOfCurrentWeek(): Date {
    return this.dayjs().startOf("week").toISOString();
  }

  getEndOfCurrentWeek(): Date {
    return this.dayjs().endOf("week").toISOString();
  }

  getStartOfCurrentYear(): Date {
    return this.dayjs().startOf("year").toISOString();
  }

  getEndOfCurrentYear(): Date {
    return this.dayjs().endOf("year").toISOString();
  }

  getStartOfCurrentMonth(): Date {
    return this.dayjs().startOf("month").toISOString();
  }

  getEndOfCurrentMonth(): Date {
    return this.dayjs().endOf("month").toISOString();
  }

  getEndOfDay(date: Date): Date {
    return this.dayjs(date).endOf("day").format();
  }

  private convertDateStringToDate(date: Date | string, inUTC = false): Date {
    if (!inUTC) return this.dayjs(date).tz(this.timezone);
    if (typeof date === "string") return new Date(date);
    return date;
    // const validDate = this.dayjs(date).tz(this.timezone).format();
    // console.log(date, new Date(validDate), validDate, "LLLLLLLL")
    // return new Date(validDate);
  }
}
