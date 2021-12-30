import AppError from "../../shared/AppError";
import UseCase from "../../shared/useCases/useCase";
import Goal from "../entities/goal";
import { GoalRepo } from "../infrastructure/repositories/goalRepo";

interface GetLiteGoalDTO {
  goalId: string;
}

export interface GetLiteGoal extends UseCase<GetLiteGoalDTO, Promise<Goal>> {
  execute: (getLiteGoalDTO: GetLiteGoalDTO) => Promise<Goal>;
}

export class GetLiteGoalImpl implements GetLiteGoal {
  constructor(private goalRepo: GoalRepo) {}

  async execute(getLiteGoalDTO: GetLiteGoalDTO): Promise<Goal> {
    const { goalId } = getLiteGoalDTO;

    const goal = await this.goalRepo.getLiteGoalById(goalId);

    if (!goal) throw AppError.notFoundError("Goal not found");

    return goal;
  }
}
