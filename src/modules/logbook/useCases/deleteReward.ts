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
  constructor(private rewardRepo: RewardRepo) {}

  async execute(deleteRewardDTO: DeleteRewardDTO) {
    const { reward } = deleteRewardDTO;

    await this.rewardRepo.delete(reward);
  }
}
