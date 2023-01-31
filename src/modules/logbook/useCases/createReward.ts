import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import { User } from "../../users/api";
import Reward from "../entities/reward";
import { RewardRepo } from "../infrastructure/repositories/rewardRepo";
import { CreateFile } from "./createFile";

export interface CreateRewardDTO {
  userId: string;
  name: string;
  description?: string;
  file?: any;
  save?: boolean;
  user: User;
}

export interface CreateReward
  extends UseCase<CreateRewardDTO, Promise<Reward>> {
  execute: (createRewardDTO: CreateRewardDTO) => Promise<Reward>;
}

export class CreateRewardImpl implements CreateReward {
  constructor(
    private uuidService: UUIDService,
    private createFile: CreateFile,
    private rewardRepo: RewardRepo
  ) {}

  async execute(createRewardDTO: CreateRewardDTO): Promise<Reward> {
    const createRewardProps = {
      userId: createRewardDTO.userId,
      name: createRewardDTO.name,
      description: createRewardDTO.description,
    };

    const reward = Reward.create(createRewardProps, this.uuidService);
    if (createRewardDTO.save) {
      // use single create instead of bulk upsert
      await this.rewardRepo.bulkUpsert([reward], createRewardDTO.user);
    }

    if (createRewardDTO.file) {
      await this.createFile.execute({
        userId: createRewardDTO.userId,
        rawFile: createRewardDTO.file,
        rewardId: reward.id,
      });
    }
    return reward;
  }
}
