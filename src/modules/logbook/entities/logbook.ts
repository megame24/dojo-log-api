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
