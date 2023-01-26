import { UUIDService } from "../../shared/infrastructure/services/uuidService";
import UseCase from "../../shared/useCases/useCase";
import Reward from "../entities/reward";
import { RewardRepo } from "../infrastructure/repositories/rewardRepo";
import { CreateFile } from "./createFile";
import { DeleteFile } from "./deleteFile";

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
    private deleteFile: DeleteFile,
    private createFile: CreateFile,
    private rewardRepo: RewardRepo
  ) {}

  async execute(updateRewardDTO: UpdateRewardDTO) {
    const { reward: outdatedReward, file, name, description } = updateRewardDTO;

    const updateRewardProps = {
      id: outdatedReward.id,
      userId: outdatedReward.userId,
      name: outdatedReward.name,
      description: outdatedReward.description,
      image: outdatedReward.image,
      ...(name && { name }),
      ...(description && { description }),
    };

    let image;
    if (file) {
      if (outdatedReward.image)
        await this.deleteFile.execute({ file: outdatedReward.image });
      image = await this.createFile.execute({
        userId: outdatedReward.userId,
        rewardId: outdatedReward.id,
        rawFile: file,
      });
      updateRewardProps.image = image;
    }

    const reward = Reward.create(updateRewardProps, this.uuidService);

    this.rewardRepo.update(reward);
  }
}
