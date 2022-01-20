import Entity from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

interface CategoryProps {
  id?: string;
  name: string;
}

// delete category

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

  private static formatName(name: string): string {
    return name.trim().toLowerCase();
  }

  static create(props: CategoryProps, uuidService: UUIDService): Category {
    this.validateProp({ key: "Name", value: props.name }, this.validateString);

    props.name = this.formatName(props.name);

    return new Category(props, uuidService);
  }
}
