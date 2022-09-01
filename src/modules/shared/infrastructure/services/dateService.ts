export type TimeMetric = "d" | "h" | "m";

export interface DateService {
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
}

export class DateServiceImpl implements DateService {
  constructor(private dayjs: any) {}

  getDayOfYear(date: Date | string): number {
    date = this.convertDateStringToDate(date);
    const dateInUTC = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const startOfYearInUTC = Date.UTC(date.getFullYear(), 0, 1);
    const diff = dateInUTC - startOfYearInUTC;
    const dayInMilliseconds = 1000 * 60 * 60 * 24;
    const dayOfYear = diff / dayInMilliseconds;
    return dayOfYear;
  }

  getDateInUTC(date: Date | string): number {
    date = this.convertDateStringToDate(date);
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  }

  getTimelessDate(date: Date | string): Date {
    date = this.convertDateStringToDate(date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  addTimeToDate(date: Date, timeValue: number, timeMetric: TimeMetric): Date {
    return this.dayjs(date).add(timeValue, timeMetric);
  }

  getStartOfCurrentWeek(): Date {
    return this.dayjs().startOf("w").toISOString();
  }

  getEndOfCurrentWeek(): Date {
    return this.dayjs().endOf("w").toISOString();
  }

  getStartOfCurrentYear(): Date {
    return this.dayjs().startOf("y").toISOString();
  }

  getEndOfCurrentYear(): Date {
    return this.dayjs().endOf("y").toISOString();
  }

  private convertDateStringToDate(date: Date | string): Date {
    if (typeof date === "string") return new Date(date);
    return date;
  }
}
