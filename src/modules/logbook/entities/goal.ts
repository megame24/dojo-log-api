import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import Reward from "./reward";

interface GoalProps {
  id?: string;
  logbookId: string;
  name: string;
  description?: string;
  achieved: boolean;
  achievementCriteria: string;
  date: Date;
  reward?: Reward;
}

export default class Goal extends Entity {
  private constructor(private props: GoalProps, uuidService: UUIDService) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get logbookId(): string {
    return this.props.logbookId;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get achieved(): boolean {
    return this.props.achieved;
  }

  get achievementCriteria(): string {
    return this.props.achievementCriteria;
  }

  get date(): Date {
    return this.props.date;
  }

  get reward(): Reward | undefined {
    return this.props.reward;
  }

  static create(props: GoalProps, uuidService: UUIDService): Goal {
    this.validateProp(
      { key: "logbookId", value: props.logbookId },
      this.isRequiredValidation
    );
    this.validateProp({ key: "Name", value: props.name }, this.validateString);
    this.validateProp(
      { key: "date", value: props.date },
      this.isRequiredValidation
    );
    this.validateProp(
      { key: "achievementCriteria", value: props.achievementCriteria },
      this.isRequiredValidation
    );

    if (!props.achieved) props.achieved = false;

    return new Goal(props, uuidService);
  }
}
