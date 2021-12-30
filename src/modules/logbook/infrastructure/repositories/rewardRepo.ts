import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import Reward from "../../entities/reward";

export interface RewardRepo {
  getRewardsByIds: (rewardIds: string[]) => Promise<Reward[]>;
  bulkUpsert: (rewards: Reward[]) => void;
}

export class RewardRepoImpl implements RewardRepo {
  constructor(
    private uuidService: UUIDService,
    private RewardModel: any,
    private Op: any
  ) {}

  private async getRewards(queryOption: any): Promise<Reward[]> {
    try {
      const rewardsData: any[] = await this.RewardModel.findAll(queryOption);

      const rewards = rewardsData.map((rewardData) =>
        Reward.create(
          {
            id: rewardData.id,
            userId: rewardData.userId,
            name: rewardData.name,
            description: rewardData.description,
            imageUrl: rewardData.imageUrl,
          },
          this.uuidService
        )
      );

      return rewards;
    } catch (error: any) {
      throw AppError.internalServerError("Error retrieving Rewards", error);
    }
  }

  async getRewardsByIds(rewardIds: string[]): Promise<Reward[]> {
    const queryOption = {
      where: { id: { [this.Op.in]: rewardIds } },
    };

    return this.getRewards(queryOption);
  }

  async bulkUpsert(rewards: Reward[]) {
    try {
      const rewardsProps = rewards.map((reward: Reward) => ({
        id: reward.id,
        userId: reward.userId,
        name: reward.name,
        description: reward.description,
        imageUrl: reward.imageUrl,
      }));

      await this.RewardModel.bulkCreate(rewardsProps, {
        updateOnDuplicate: ["id"],
      });
    } catch (error: any) {
      throw AppError.internalServerError("Error creating Rewards", error);
    }
  }
}
