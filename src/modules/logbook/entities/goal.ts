interface BaseGoalProps {
  id?: string;
  logbookId: string;
  name: string;
  description?: string;
  achieved: boolean;
  achievementCriteria: string;
  date: Date;
}

interface GoalProps extends BaseGoalProps {
  // consider making reward it's own entity
  reward: any;
}

interface CreateGoalProps extends BaseGoalProps {
  rewardId?: string;
}
