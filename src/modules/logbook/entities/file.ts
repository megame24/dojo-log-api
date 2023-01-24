import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

type fileType = "image" | "document";

interface FileProps {
  id?: string;
  userId: string;
  logId?: string;
  rewardId?: string;
  type: fileType;
  url: string;
  name: string;
}

export default class File extends Entity {
  private constructor(private props: FileProps, uuidService: UUIDService) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get logId(): string | undefined {
    return this.props.logId;
  }

  get rewardId(): string | undefined {
    return this.props.rewardId;
  }

  get type(): fileType {
    return this.props.type;
  }

  get url(): string {
    return this.props.url;
  }

  get name(): string {
    return this.props.name;
  }

  static create(props: FileProps, uuidService: UUIDService): File {
    this.validateProp(
      { key: "userId", value: props.userId },
      this.isRequiredValidation
    );

    this.validateProp(
      { key: "type", value: props.type },
      this.isRequiredValidation
    );

    this.validateProp(
      { key: "url", value: props.url },
      this.isRequiredValidation
    );

    this.validateProp({ key: "name", value: props.name }, this.validateString);

    return new File(props, uuidService);
  }
}
