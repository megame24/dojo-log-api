import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

interface RewardProps {
  id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export default class Reward extends Entity {
  private constructor(private props: RewardProps, uuidService: UUIDService) {
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

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  static create(props: RewardProps, uuidService: UUIDService): Reward {
    this.validateProp({ key: "Name", value: props.name }, this.validateString);

    return new Reward(props, uuidService);
  }
}
