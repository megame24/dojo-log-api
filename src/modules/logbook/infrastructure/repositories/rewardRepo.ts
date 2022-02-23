import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import Reward from "../../entities/reward";

export interface RewardRepo {
  getRewardsByIds: (rewardIds: string[]) => Promise<Reward[]>;
  getRewardsByUserId: (userId: string) => Promise<Reward[]>;
  bulkUpsert: (rewards: Reward[]) => void;
  delete: (reward: Reward) => void;
  getRewardById: (rewardId: string) => Promise<Reward | null>;
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

  async getRewardsByUserId(userId: string): Promise<Reward[]> {
    if (!userId) throw AppError.badRequestError("userId is required");

    const queryOption = {
      where: { userId },
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

  async delete(reward: Reward) {
    try {
      await this.RewardModel.destroy({ where: { id: reward.id } });
    } catch (error: any) {
      throw AppError.internalServerError("Error deleting Reward", error);
    }
  }

  private async getReward(queryOption: any): Promise<Reward | null> {
    let rewardData: any;
    try {
      rewardData = await this.RewardModel.findOne(queryOption);
    } catch (error: any) {
      throw AppError.internalServerError("Error retrieving Reward", error);
    }

    if (!rewardData) return null;

    const reward = Reward.create(
      {
        id: rewardData.id,
        userId: rewardData.userId,
        name: rewardData.name,
        description: rewardData.description,
        imageUrl: rewardData.imageUrl,
      },
      this.uuidService
    );

    return reward;
  }

  async getRewardById(rewardId: string): Promise<Reward | null> {
    if (!rewardId) throw AppError.badRequestError("rewardId is required");

    const queryOption = {
      where: { id: rewardId },
    };

    return this.getReward(queryOption);
  }
}
