import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";
import Reward from "../entities/reward";
import { RewardRepo } from "../infrastructure/repositories/rewardRepo";

interface GetRewardDTO {
  rewardId: string;
}

export interface GetReward extends UseCase<GetRewardDTO, Promise<Reward>> {
  execute: (getRewardDTO: GetRewardDTO) => Promise<Reward>;
}

export class GetRewardImpl implements GetReward {
  constructor(private rewardRepo: RewardRepo) {}

  async execute(getRewardDTO: GetRewardDTO): Promise<Reward> {
    const { rewardId } = getRewardDTO;

    const reward = await this.rewardRepo.getRewardById(rewardId);

    if (!reward) throw AppError.notFoundError("Reward not found");

    return reward;
  }
}
