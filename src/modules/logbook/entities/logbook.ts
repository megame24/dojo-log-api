import Entity from "../../shared/entities/entity";
import { DateService } from "../../shared/infrastructure/services/dateService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import Category from "./category";
import Goal from "./goal";
import Log from "./log";

export enum Visibility {
  public = "public",
  private = "private",
}

interface BaseLogbookProps {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  visibility: Visibility;
  category?: Category | null | undefined;
  updatedAt?: Date;
}

interface LogbookProps extends BaseLogbookProps {
  heatmap: any;
  yearHeatmapDisplay: any;
}

interface CreateLogbookProps extends BaseLogbookProps {
  goals?: Goal[];
  logs?: Log[];
  year?: string;
}

export default class Logbook extends Entity {
  private static colors: any = {
    primary: "#2980B9",
    borderGray: "rgba(0,0,0,0.1)",
    primary25Per: "#cadfee",
    primary50Per: "#94c0dc",
    primary75Per: "#5fa0cb",
  };

  private constructor(private props: LogbookProps, uuidService: UUIDService) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get heatmap(): any {
    return this.props.heatmap;
  }

  get yearHeatmapDisplay(): any {
    return this.props.yearHeatmapDisplay;
  }

  get visibility(): Visibility {
    return this.props.visibility;
  }

  get category(): Category | null | undefined {
    return this.props.category;
  }

  get userId(): string {
    return this.props.userId;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  private static saveLogsToHeatmap(
    heatmap: any,
    props: CreateLogbookProps,
    dateService: DateService
  ) {
    const { id, logs = [] } = props;
    logs.forEach((log) => {
      if (log.logbookId !== id) return;

      const dayOfYear = dateService.getDayOfYear(log.date);

      if (!heatmap[dayOfYear]) {
        heatmap[dayOfYear] = {
          logs: {
            count: 1,
            startDate: log.date,
            endDate: log.date,
            totalDurationOfWorkInMinutes: log.durationOfWorkInMinutes,
            logIds: [log.id],
          },
        };
      } else {
        heatmap[dayOfYear].logs.count += 1;
        heatmap[dayOfYear].logs.totalDurationOfWorkInMinutes +=
          log.durationOfWorkInMinutes;
        heatmap[dayOfYear].logs.logIds.push(log.id);
        heatmap[dayOfYear].logs.startDate =
          log.date < heatmap[dayOfYear].logs.startDate
            ? log.date
            : heatmap[dayOfYear].logs.startDate;
        heatmap[dayOfYear].logs.endDate =
          log.date > heatmap[dayOfYear].logs.endDate
            ? log.date
            : heatmap[dayOfYear].logs.endDate;
      }
    });
  }

  private static saveGoalsToHeatmap(
    heatmap: any,
    props: CreateLogbookProps,
    dateService: DateService
  ) {
    const { id, goals = [] } = props;
    goals.forEach((goal) => {
      if (goal.logbookId !== id) return;

      const dayOfYear = dateService.getDayOfYear(goal.date);

      const heatmapRewards = goal.rewards?.map((reward) => ({
        id: reward.id,
        name: reward.name,
        description: reward.description,
        image: reward.image,
      }));

      const heatmapGoal = {
        id: goal.id,
        name: goal.name,
        achieved: goal.achieved,
        achievementCriteria: goal.achievementCriteria,
        rewards: heatmapRewards,
      };

      if (!heatmap[dayOfYear]) {
        heatmap[dayOfYear] = {
          goal: heatmapGoal,
        };
      } else {
        heatmap[dayOfYear].goal = heatmapGoal;
      }
    });
  }

  private static getHeatmapCellColorFromDuration(durationInMinutes: number) {
    if (!durationInMinutes) return this.colors.borderGray;
    const totalHours = durationInMinutes / 60;
    let color = this.colors.primary25Per;
    if (totalHours >= 1) color = this.colors.primary50Per;
    if (totalHours >= 3) color = this.colors.primary75Per;
    if (totalHours >= 5) color = this.colors.primary;
    return color;
  }

  private static createYearHeatmapDisplay(
    heatmap: any,
    props: CreateLogbookProps,
    dateService: DateService
  ) {
    const { year } = props;
    if (!year) return [];
    const startOfYear = dateService.getStartOfYear(year);
    const startOfYearDayValue = dateService.getDay(startOfYear, true);
    const startOfYearDayOfYear = dateService.getDayOfYear(startOfYear);
    const startOfCalendarYearDayOfYear =
      startOfYearDayOfYear - startOfYearDayValue;

    const endOfYear = dateService.getEndOfYear(year);
    const endOfYearDayOfYear = dateService.getDayOfYear(endOfYear);

    const today = dateService.convertDateStringToDate(new Date(), true);
    const todayDayOfYear = dateService.getDayOfYear(today);

    let weekTracker = 0;
    let monthTracker = 2;
    let monthTrackingDone = false;
    const yearHeatmap: any[] = [];
    for (let i = startOfCalendarYearDayOfYear; i <= endOfYearDayOfYear; i++) {
      const dayOfYearDate = dateService.convertDateStringToDate(
        dateService.getDateFromDayOfYear(year, i),
        true
      );
      const yearHeatmapElement: any = {
        index: i + "",
      };
      const day = dateService.days[dateService.getDay(dayOfYearDate, false)];
      if (day === dateService.days[0]) {
        const monthValue = dateService.getMonth(dayOfYearDate, false);
        if (monthTracker % 2 === 0)
          yearHeatmapElement.month = dateService.months[monthValue];
        if (monthTracker === 4 && !monthTrackingDone) {
          if (i >= startOfYearDayOfYear && monthValue === 11)
            monthTrackingDone = true;
          yearHeatmapElement.monthVisible = true;
          monthTracker = 0;
        }
        monthTracker++;
      }
      if (weekTracker < 14) {
        yearHeatmapElement.day = " ";
        yearHeatmapElement.inactiveDay = true;
        if (weekTracker % 2 === 0) {
          yearHeatmapElement.day = day;
          yearHeatmapElement.inactiveDay = false;
        }
      }
      if (i === todayDayOfYear) yearHeatmapElement.isToday = true;
      if (i < startOfYearDayOfYear) yearHeatmapElement.inactive = true;
      weekTracker++;

      const heatmapElement = heatmap[i];
      if (heatmapElement) {
        if (heatmapElement.goal) {
          yearHeatmapElement.goalId = heatmapElement.goal.id;
          yearHeatmapElement.hasGoal = true;
          yearHeatmapElement.goalAchieved = heatmapElement.goal.achieved;
        }
        if (heatmapElement.logs) {
          yearHeatmapElement.color = this.getHeatmapCellColorFromDuration(
            heatmapElement.logs.totalDurationOfWorkInMinutes
          );
        }
      }
      yearHeatmap.push(yearHeatmapElement);
    }

    return yearHeatmap;
  }

  private static createHeatmap(
    props: CreateLogbookProps,
    dateService: DateService
  ) {
    const heatmap: any = {};

    this.saveLogsToHeatmap(heatmap, props, dateService);
    this.saveGoalsToHeatmap(heatmap, props, dateService);

    return heatmap;
  }

  static create(
    createLogbookProps: CreateLogbookProps,
    uuidService: UUIDService,
    dateService: DateService
  ): Logbook {
    const props = { ...createLogbookProps };

    this.validateProp(
      { key: "userId", value: props.userId },
      this.isRequiredValidation
    );
    this.validateProp({ key: "Name", value: props.name }, this.validateString);
    this.validateProp(
      {
        key: "logbook visibility",
        value: props.visibility,
        Enum: Visibility,
      },
      this.validateEnum
    );

    const heatmap = this.createHeatmap(props, dateService);

    const yearHeatmapDisplay = this.createYearHeatmapDisplay(
      heatmap,
      props,
      dateService
    );

    return new Logbook({ ...props, heatmap, yearHeatmapDisplay }, uuidService);
  }
}
