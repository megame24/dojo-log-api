import { UUIDService } from "../../shared/infrastructure/services/uuidService";

interface CategoryProps {
  id?: string;
  name: string;
}

export default class Category {
  private constructor(private props: CategoryProps) {}

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  static create(props: CategoryProps, uuidService: UUIDService): Category {
    if (!props.id) {
      props.id = uuidService.generate();
    }

    return new Category(props);
  }
}
