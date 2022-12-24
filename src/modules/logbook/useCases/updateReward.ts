import { FileService } from "../../shared/infrastructure/services/fileService";
import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Reward from "../entities/reward";
import { RewardRepo } from "../infrastructure/repositories/rewardRepo";

export interface UpdateRewardDTO {
  reward: Reward;
  name?: string;
  description?: string;
  file?: any;
}

export interface UpdateReward extends UseCase<UpdateRewardDTO, void> {
  execute: (updateRewardDTO: UpdateRewardDTO) => void;
}

export class UpdateRewardImpl implements UpdateReward {
  constructor(
    private uuidService: UUIDService,
    private fileService: FileService,
    private rewardRepo: RewardRepo
  ) {}

  async execute(updateRewardDTO: UpdateRewardDTO) {
    const { reward: outdatedReward, file, name, description } = updateRewardDTO;

    let imageUrl;
    if (file) {
      if (outdatedReward.imageUrl)
        await this.fileService.deleteFile(outdatedReward.imageUrl);
      imageUrl = await this.fileService.uploadFile(file);
    }

    const updateRewardProps = {
      id: outdatedReward.id,
      userId: outdatedReward.userId,
      name: outdatedReward.name,
      description: outdatedReward.description,
      imageUrl: outdatedReward.imageUrl,
      ...(imageUrl && { imageUrl }),
      ...(name && { name }),
      ...(description && { description }),
    };

    const reward = Reward.create(updateRewardProps, this.uuidService);

    this.rewardRepo.update(reward);
  }
}
