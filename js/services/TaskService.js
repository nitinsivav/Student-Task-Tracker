let tasks = [];
let hasLoadedTasks = false;

const TaskService = {
  getTasks: async () => {
    if (!hasLoadedTasks) {
      const response = await fetch("/js/data/tasks.json");

      if (!response.ok) {
        throw new Error("Unable to load starter tasks.");
      }

      const starterTasks = await response.json();

      tasks = starterTasks.map((task) => ({ ...task }));
      hasLoadedTasks = true;
    }

    return tasks.map((task) => ({ ...task }));
  }
};

export default TaskService;