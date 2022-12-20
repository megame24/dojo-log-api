import { FileService } from "../../shared/infrastructure/services/fileService";
import UseCase from "../../shared/useCases/useCase";
import Reward from "../entities/reward";
import { RewardRepo } from "../infrastructure/repositories/rewardRepo";

interface DeleteRewardDTO {
  reward: Reward;
}

export interface DeleteReward extends UseCase<DeleteRewardDTO, void> {
  execute: (deleteRewardDTO: DeleteRewardDTO) => void;
}

export class DeleteRewardImpl implements DeleteReward {
  constructor(
    private rewardRepo: RewardRepo,
    private fileService: FileService
  ) {}

  async execute(deleteRewardDTO: DeleteRewardDTO) {
    const { reward } = deleteRewardDTO;

    if (reward.imageUrl) this.fileService.deleteFile(reward.imageUrl);

    await this.rewardRepo.delete(reward);
  }
}
