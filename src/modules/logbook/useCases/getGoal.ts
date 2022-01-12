import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";
import Goal from "../entities/goal";
import { GoalRepo } from "../infrastructure/repositories/goalRepo";

interface GetGoalDTO {
  goalId: string;
}

export interface GetGoal extends UseCase<GetGoalDTO, Promise<Goal>> {
  execute: (getGoalDTO: GetGoalDTO) => Promise<Goal>;
}

export class GetGoalImpl implements GetGoal {
  constructor(private goalRepo: GoalRepo) {}

  async execute(getGoalDTO: GetGoalDTO): Promise<Goal> {
    const { goalId } = getGoalDTO;

    const goal = await this.goalRepo.getGoalById(goalId);

    if (!goal) throw AppError.notFoundError("Goal not found");

    return goal;
  }
}
