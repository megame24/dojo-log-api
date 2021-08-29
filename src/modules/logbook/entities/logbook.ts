import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import { DateService } from "../infrastructure/services/dateService";
import Category from "./category";
import Goal from "./goal";
import Log from "./log";

export enum LogbookVisibility {
  public = "public",
  private = "private",
}

interface BaseLogbookProps {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  visibility: LogbookVisibility;
  category: Category;
}

interface LogbookProps extends BaseLogbookProps {
  // this would be an object of timestamp to singular heat map details
  heatMap: any; // or plain logs .... or pass in plain logs & goals and get heatMap
}

interface CreateLogbookProps extends BaseLogbookProps {
  goals?: Goal[];
  logs?: Log[];
}

// idea
// have a getLogbookLite repo method!!!!

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

  get visibility(): LogbookVisibility {
    return this.props.visibility;
  }

  get category(): Category {
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
            date: new Date(
              log.date.getFullYear(),
              log.date.getMonth(),
              log.date.getDate()
            ),
          },
        };
      } else {
        heatMap[dayOfYear].logs.count += 1;
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

      heatMap[dayOfYear].goal = {
        id: goal.id,
        name: goal.name,
        achieved: goal.achieved,
        rewards: goal.rewards,
      };
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
        Enum: LogbookVisibility,
      },
      this.validateEnum
    );
    this.validateProp(
      { key: "Category", value: props.category },
      this.isRequiredValidation
    );

    const heatMap = this.createHeatMap(props, dateService);

    return new Logbook({ ...props, heatMap }, uuidService);
  }
}
