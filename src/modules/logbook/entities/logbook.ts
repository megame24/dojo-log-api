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
}

interface LogbookProps extends BaseLogbookProps {
  heatmap: any;
}

interface CreateLogbookProps extends BaseLogbookProps {
  goals?: Goal[];
  logs?: Log[];
}

export default class Logbook extends Entity {
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

  get visibility(): Visibility {
    return this.props.visibility;
  }

  get category(): Category | null | undefined {
    return this.props.category;
  }

  get userId(): string {
    return this.props.userId;
  }

  private static addDurationOfWork(
    acc: string | undefined,
    next: string | undefined
  ) {
    // find a better solution!!!
    if (!next) return acc;
    if (!acc) return next;

    const durationOfWorkTracker: any = {
      h: 0,
      m: 0,
    };
    const accSplit = acc.split(" ");
    accSplit.forEach((duration) => {
      const durationMetric = duration
        .slice(duration.length - 1, duration.length)
        .toLocaleLowerCase();
      const durationSplit = duration.split(durationMetric);
      durationOfWorkTracker[durationMetric] = +durationSplit[0];
    });

    const nextSplit = next.split(" ");
    nextSplit.forEach((duration) => {
      const durationMetric = duration
        .slice(duration.length - 1, duration.length)
        .toLocaleLowerCase();
      const durationSplit = duration.split(durationMetric);
      if (durationMetric === "m") {
        const totalMinutes = +durationOfWorkTracker.m + +durationSplit[0];
        durationOfWorkTracker.h += Math.floor(totalMinutes / 60);
        durationOfWorkTracker.m = totalMinutes % 60;
      } else {
        durationOfWorkTracker[durationMetric] += +durationSplit[0];
      }
    });

    return `${durationOfWorkTracker.h}h ${durationOfWorkTracker.m}m`;
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
            totalDurationOfWork: log.durationOfWork,
            logIds: [log.id],
          },
        };
      } else {
        const totalDurationOfWork = heatmap[dayOfYear].logs.totalDurationOfWork;
        heatmap[dayOfYear].logs.count += 1;
        heatmap[dayOfYear].logs.totalDurationOfWork = this.addDurationOfWork(
          totalDurationOfWork,
          log.durationOfWork
        );
        heatmap[dayOfYear].logs.logIds.push(log.id);
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
        imageUrl: reward.imageUrl,
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

    return new Logbook({ ...props, heatmap }, uuidService);
  }
}
