import { FileService } from "../../shared/infrastructure/services/fileService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import { User } from "../../users/api";
import Reward from "../entities/reward";
import { RewardRepo } from "../infrastructure/repositories/rewardRepo";

export interface CreateRewardDTO {
  userId: string;
  name: string;
  description?: string;
  file?: any;
  save?: true;
  user: User;
}

export interface CreateReward
  extends UseCase<CreateRewardDTO, Promise<Reward>> {
  execute: (createRewardDTO: CreateRewardDTO) => Promise<Reward>;
}

export class CreateRewardImpl implements CreateReward {
  constructor(
    private uuidService: UUIDService,
    private fileService: FileService,
    private rewardRepo: RewardRepo
  ) {}

  async execute(createRewardDTO: CreateRewardDTO): Promise<Reward> {
    let imageUrl;
    if (createRewardDTO.file) {
      imageUrl = await this.fileService.uploadFile(createRewardDTO.file);
    }

    const createRewardProps = {
      userId: createRewardDTO.userId,
      name: createRewardDTO.name,
      description: createRewardDTO.description,
      imageUrl,
    };

    const reward = Reward.create(createRewardProps, this.uuidService);
    if (createRewardDTO.save) {
      // use single create instead of bulk upsert
      await this.rewardRepo.bulkUpsert([reward], createRewardDTO.user);
    }
    return reward;
  }
}
