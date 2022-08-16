import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

interface CategoryProps {
  id?: string;
  name: string;
  color: string;
  iconName: string;
}

export default class Category extends Entity {
  private constructor(private props: CategoryProps, uuidService: UUIDService) {
    super(props, uuidService);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get color(): string {
    return this.props.color;
  }

  get iconName(): string {
    return this.props.iconName;
  }

  private static formatProp(name: string): string {
    return name.trim().toLowerCase();
  }

  static create(props: CategoryProps, uuidService: UUIDService): Category {
    this.validateProp({ key: "Name", value: props.name }, this.validateString);
    this.validateProp(
      { key: "Color", value: props.color },
      this.validateString
    );
    this.validateProp(
      { key: "Icon Name", value: props.iconName },
      this.validateString
    );

    props.name = this.formatProp(props.name);
    props.color = this.formatProp(props.color);

    return new Category(props, uuidService);
  }
}
