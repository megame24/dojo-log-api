import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import File from "./file";

interface RewardProps {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  image?: File;
}

export default class Reward extends Entity {
  private constructor(private props: RewardProps, uuidService: UUIDService) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get image(): File | undefined {
    return this.props.image;
  }

  static create(props: RewardProps, uuidService: UUIDService): Reward {
    this.validateProp(
      { key: "userId", value: props.userId },
      this.isRequiredValidation
    );
    this.validateProp({ key: "Name", value: props.name }, this.validateString);

    return new Reward(props, uuidService);
  }
}
