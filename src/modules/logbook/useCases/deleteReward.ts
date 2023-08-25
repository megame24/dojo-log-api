import UseCase from "../../shared/useCases/useCase";
import Reward from "../entities/reward";
import { RewardRepo } from "../infrastructure/repositories/rewardRepo";
import { DeleteFile } from "./deleteFile";

interface DeleteRewardDTO {
  reward: Reward;
}

export interface DeleteReward extends UseCase<DeleteRewardDTO, void> {
  execute: (deleteRewardDTO: DeleteRewardDTO) => void;
}

export class DeleteRewardImpl implements DeleteReward {
  constructor(private rewardRepo: RewardRepo, private deleteFile: DeleteFile) {}

  async execute(deleteRewardDTO: DeleteRewardDTO) {
    const { reward } = deleteRewardDTO;

    if (reward.image) {
      await this.deleteFile.execute({
        userId: reward.userId,
        file: reward.image,
      });
    }

    await this.rewardRepo.delete(reward);
  }
}
