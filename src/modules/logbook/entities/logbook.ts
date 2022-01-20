import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import { DateService } from "../infrastructure/services/dateService";
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
  heatMap: any;
}

interface CreateLogbookProps extends BaseLogbookProps {
  goals?: Goal[];
  logs?: Log[];
}

// can update and delete, delete should cascade
// can also update the category, make category optional

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

  get heatMap(): any {
    return this.props.heatMap;
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

  private static saveLogsToHeatMap(
    heatMap: any,
    props: CreateLogbookProps,
    dateService: DateService
  ) {
    const { id, logs = [] } = props;
    logs.forEach((log) => {
      if (log.logbookId !== id) return;

      const dayOfYear = dateService.getDayOfYear(log.date);

      if (!heatMap[dayOfYear]) {
        heatMap[dayOfYear] = {
          logs: {
            count: 1,
            logIds: [log.id],
          },
        };
      } else {
        heatMap[dayOfYear].logs.count += 1;
        heatMap[dayOfYear].logs.logIds.push(log.id);
      }
    });
  }

  private static saveGoalsToHeatMap(
    heatMap: any,
    props: CreateLogbookProps,
    dateService: DateService
  ) {
    const { id, goals = [] } = props;
    goals.forEach((goal) => {
      if (goal.logbookId !== id) return;

      const dayOfYear = dateService.getDayOfYear(goal.date);

      const heatMapRewards = goal.rewards?.map((reward) => ({
        id: reward.id,
        name: reward.name,
        description: reward.description,
        imageUrl: reward.imageUrl,
      }));

      const heatMapGoal = {
        id: goal.id,
        name: goal.name,
        achieved: goal.achieved,
        achievementCriteria: goal.achievementCriteria,
        rewards: heatMapRewards,
      };

      if (!heatMap[dayOfYear]) {
        heatMap[dayOfYear] = {
          goal: heatMapGoal,
        };
      } else {
        heatMap[dayOfYear].goal = heatMapGoal;
      }
    });
  }

  private static createHeatMap(
    props: CreateLogbookProps,
    dateService: DateService
  ) {
    const heatMap: any = {};

    this.saveLogsToHeatMap(heatMap, props, dateService);
    this.saveGoalsToHeatMap(heatMap, props, dateService);

    return heatMap;
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

    const heatMap = this.createHeatMap(props, dateService);

    return new Logbook({ ...props, heatMap }, uuidService);
  }
}
