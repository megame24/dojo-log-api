import AppError from "../../../shared/AppError";
import { UUIDService } from "../../../shared/infrastructure/services/uuidService";
import User from "../../../users/entities/user";
import File from "../../entities/file";
import Reward from "../../entities/reward";

export interface RewardRepo {
  getRewardsByIds: (rewardIds: string[]) => Promise<Reward[]>;
  getRewardsByUserId: (userId: string) => Promise<Reward[]>;
  bulkUpsert: (rewards: Reward[], createdBy: User) => void;
  delete: (reward: Reward) => void;
  getRewardById: (rewardId: string) => Promise<Reward | null>;
  update: (reward: Reward) => void;
}

export class RewardRepoImpl implements RewardRepo {
  constructor(
    private uuidService: UUIDService,
    private RewardModel: any,
    private FileModel: any,
    private Op: any
  ) {}

  private async getRewards(queryOption: any): Promise<Reward[]> {
    try {
      const rewardsData: any[] = await this.RewardModel.findAll(queryOption);

      const rewards = rewardsData.map((rewardData) => {
        const fileData = rewardData?.Files ? rewardData?.Files[0] : undefined;

        let image;
        if (fileData) {
          const createFileProps = {
            id: fileData.id,
            userId: fileData.userId,
            rewardId: fileData.rewardId,
            type: fileData.type,
            url: fileData.url,
            name: fileData.name,
            visibility: fileData.visibility,
          };

          image = File.create(createFileProps, this.uuidService);
        }

        return Reward.create(
          {
            id: rewardData.id,
            userId: rewardData.userId,
            name: rewardData.name,
            description: rewardData.description,
            image,
          },
          this.uuidService
        );
      });

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
      include: { model: this.FileModel, required: false },
    };

    return this.getRewards(queryOption);
  }

  async bulkUpsert(rewards: Reward[], createdBy: User) {
    try {
      const rewardsProps = rewards.map((reward: Reward) => ({
        id: reward.id,
        userId: reward.userId,
        createdBy: createdBy.id,
        name: reward.name,
        description: reward.description,
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

    const fileData = rewardData?.Files ? rewardData?.Files[0] : undefined;

    let image;
    if (fileData) {
      const createFileProps = {
        id: fileData.id,
        userId: fileData.userId,
        rewardId: fileData.rewardId,
        type: fileData.type,
        url: fileData.url,
        name: fileData.name,
        visibility: fileData.visibility,
      };

      image = File.create(createFileProps, this.uuidService);
    }

    const reward = Reward.create(
      {
        id: rewardData.id,
        userId: rewardData.userId,
        name: rewardData.name,
        description: rewardData.description,
        image,
      },
      this.uuidService
    );

    return reward;
  }

  async getRewardById(rewardId: string): Promise<Reward | null> {
    if (!rewardId) throw AppError.badRequestError("rewardId is required");

    const queryOption = {
      where: { id: rewardId },
      include: { model: this.FileModel, required: false },
    };

    return this.getReward(queryOption);
  }

  async update(reward: Reward) {
    try {
      const updateRewardProps = {
        id: reward.id,
        userId: reward.userId,
        name: reward.name,
        description: reward.description,
      };
      await this.RewardModel.update(updateRewardProps, {
        where: { id: reward.id },
      });
    } catch (error: any) {
      throw AppError.internalServerError("Error updating Reward", error);
    }
  }
}
