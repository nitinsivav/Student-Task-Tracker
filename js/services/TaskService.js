const validStatuses = [
  "not-done",
  "in-progress",
  "completed"
];

let tasks = [];
let hasLoadedTasks = false;
let taskLoadPromise = null;

const loadTasks = async () => {
  const response = await fetch("/js/data/tasks.json");

  if (!response.ok) {
    throw new Error("Unable to load starter tasks.");
  }

  const starterTasks = await response.json();

  tasks = starterTasks.map((task) => ({ ...task }));
  hasLoadedTasks = true;
};

const TaskService = {
  getTasks: async () => {
    if (!hasLoadedTasks) {
      if (!taskLoadPromise) {
        taskLoadPromise = loadTasks();
      }

      await taskLoadPromise;
    }

    return tasks.map((task) => ({ ...task }));
  },

  updateTaskStatus: async (taskId, status) => {
    await TaskService.getTasks();

    if (!validStatuses.includes(status)) {
      throw new Error("Invalid task status.");
    }

    const task = tasks.find((currentTask) => {
      return currentTask.id === taskId;
    });

    if (!task) {
      throw new Error("Task not found.");
    }

    task.status = status;

    return { ...task };
  }
};

export default TaskService;