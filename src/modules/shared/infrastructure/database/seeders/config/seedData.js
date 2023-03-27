const uuidv4 = require("uuid").v4;

const randomDateIn2022 = () => {
  const start = new Date(2022, 0, 1);
  const end = new Date(2022, 11, 31);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

function randomNumber(min, max) {
  return Math.floor(min + Math.random() * max);
}

const users = [
  {
    id: uuidv4(),
    name: "Ultimate user",
    password: "$2a$10$UFd4QSYBaVw2tg1zN409YerwzBTttsHB.5BpVXr0LrrJTA/YEPrQG",
    username: "ultimateUser",
    email: "ultimate@test.com",
    verified: true,
    role: "ADMIN",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    name: "User 1",
    password: "$2a$10$UFd4QSYBaVw2tg1zN409YerwzBTttsHB.5BpVXr0LrrJTA/YEPrQG",
    username: "user1",
    email: "user1@test.com",
    verified: true,
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    name: "User 2",
    password: "$2a$10$UFd4QSYBaVw2tg1zN409YerwzBTttsHB.5BpVXr0LrrJTA/YEPrQG",
    username: "user2",
    email: "user2@test.com",
    verified: true,
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const categories = [
  {
    id: uuidv4(),
    name: "Art",
    color: "skyblue",
    iconName: "brush",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    name: "Study",
    color: "#9b59b6",
    iconName: "school-outline",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    name: "Fitness",
    color: "#2ECC71",
    iconName: "barbell-sharp",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    name: "Relationship",
    color: "#FDA7DF",
    iconName: "heart-outline",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const logbooks = [];

function generateLogbooks() {
  for (let i = 0; i < 16; i++) {
    const userId = users[randomNumber(1, 2)].id;
    logbooks.push({
      id: uuidv4(),
      name: `Logbook ${i}`,
      description: "This is just an ordinary logbook, nothing to see here!",
      visibility: "public",
      categoryId: categories[randomNumber(0, 4)].id,
      userId,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
generateLogbooks();

const goals = [];

const usersGoals = {
  [users[1].id]: [],
  [users[2].id]: [],
};

function generateGoals() {
  const trueOrFalse = [true, false];
  for (let i = 0; i < logbooks.length; i++) {
    for (let j = 0; j < randomNumber(2, 14); j++) {
      const userId = logbooks[i].userId;
      const goal = {
        id: uuidv4(),
        logbookId: logbooks[i].id,
        userId,
        createdBy: userId,
        name: `Goal ${j}`,
        achieved: trueOrFalse[randomNumber(0, 2)],
        achievementCriteria: "Just do it bro!!!",
        date: randomDateIn2022(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      goals.push(goal);
      usersGoals[logbooks[i].userId].push(goal.id);
    }
  }
}

generateGoals();

const rewards = [];

const usersRewards = {
  [users[1].id]: [],
  [users[2].id]: [],
};

function generateRewards() {
  for (let i = 1; i < users.length; i++) {
    for (let j = 0; j < randomNumber(2, 4); j++) {
      const userId = users[i].id;
      const reward = {
        id: uuidv4(),
        userId,
        createdBy: userId,
        name: `Reward ${j}`,
        description: "Something light",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      rewards.push(reward);
      usersRewards[users[i].id].push(reward.id);
    }
  }
}

generateRewards();

const goalRewards = [];

function generateGoalRewards() {
  for (let i = 1; i < users.length; i++) {
    const userId = users[i].id;
    for (let j = 0; j < usersGoals[userId].length - 1; j++) {
      for (let k = 0; k < randomNumber(1, usersRewards[userId].length); k++) {
        goalRewards.push({
          goalId: usersGoals[userId][j],
          rewardId: usersRewards[userId][k],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }
}

generateGoalRewards();

const logs = [];

function generateLogs() {
  for (let i = 0; i < logbooks.length; i++) {
    for (let j = 0; j < randomNumber(200, 300); j++) {
      const userId = logbooks[i].userId;
      logs.push({
        id: uuidv4(),
        logbookId: logbooks[i].id,
        userId,
        createdBy: userId,
        message: `Did work ${j}`,
        durationOfWorkInMinutes: randomNumber(1, 1380),
        date: randomDateIn2022(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
}

generateLogs();

module.exports = {
  users,
  categories,
  logbooks,
  goals,
  rewards,
  goalRewards,
  logs,
};
