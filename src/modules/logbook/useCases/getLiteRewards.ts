import UseCase from "../../shared/useCases/useCase";
import Reward from "../entities/reward";
import { RewardRepo } from "../infrastructure/repositories/rewardRepo";

interface GetLiteRewardsDTO {
  rewardIds: string[] | string;
}

export interface GetLiteRewards
  extends UseCase<GetLiteRewardsDTO, Promise<Reward[]>> {
  execute: (getLiteRewardsDTO: GetLiteRewardsDTO) => Promise<Reward[]>;
}

export class GetLiteRewardsImpl implements GetLiteRewards {
  constructor(private rewardRepo: RewardRepo) {}

  async execute(getLiteRewardsDTO: GetLiteRewardsDTO): Promise<Reward[]> {
    let { rewardIds = [] } = getLiteRewardsDTO;
    if (typeof rewardIds === "string") rewardIds = JSON.parse(rewardIds);

    const rewards = await this.rewardRepo.getRewardsByIds(<string[]>rewardIds);
    return rewards;
  }
}
