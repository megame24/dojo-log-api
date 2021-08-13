export interface UUIDService {
  generate: () => string;
}

export class UUIDServiceImpl implements UUIDService {
  constructor(private uuidv4: any) {}

  generate(): string {
    return this.uuidv4();
  }
}
