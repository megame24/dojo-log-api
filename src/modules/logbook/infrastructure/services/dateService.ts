export interface DateService {
  getDayOfYear: (date: Date) => number;
}

export class DateServiceImpl implements DateService {
  getDayOfYear(date: Date): number {
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
}
