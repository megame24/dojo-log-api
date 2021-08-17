import Entity, { ValidationResult } from "../../shared/entities/entity";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";

interface CategoryProps {
  id?: string;
  name: string;
}

export default class Category extends Entity {
  private constructor(private props: CategoryProps) {
    super();
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  private static validateName(name: string): ValidationResult {
    if (!name) return { isValid: false, message: "Name is required" };
    return Category.validValidationResult;
  }

  private static formatName(name: string): string {
    return name.trim().toLowerCase();
  }

  static create(props: CategoryProps, uuidService: UUIDService): Category {
    this.validateProp(props.name, this.validateName);
    props.name = this.formatName(props.name);

    if (!props.id) {
      props.id = uuidService.generate();
    }

    return new Category(props);
  }
}
