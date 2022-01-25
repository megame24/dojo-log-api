import UseCase from "../../shared/useCases/useCase";
import Reward from "../entities/reward";
import { RewardRepo } from "../infrastructure/repositories/rewardRepo";

interface GetRewardsDTO {
  userId: string;
}

export interface GetRewards extends UseCase<GetRewardsDTO, Promise<Reward[]>> {
  execute: (getRewardsDTO: GetRewardsDTO) => Promise<Reward[]>;
}

export class GetRewardsImpl implements GetRewards {
  constructor(private rewardRepo: RewardRepo) {}

  async execute(getRewardsDTO: GetRewardsDTO): Promise<Reward[]> {
    const { userId } = getRewardsDTO;

    const rewards = await this.rewardRepo.getRewardsByUserId(userId);
    return rewards;
  }
}
