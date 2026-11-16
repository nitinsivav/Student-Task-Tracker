import "./StudentKanban.js";
import "./StudentHistory.js";
import TaskService from "../services/TaskService.js";

export class StudentDashboard extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });

    const styles = document.createElement("style");
    this.root.appendChild(styles);

    this.section = document.createElement("section");
    this.root.appendChild(this.section);

    async function loadCSS() {
      const request = await fetch("/js/components/StudentDashboard.css");
      styles.textContent = await request.text();
    }

    loadCSS();
  }

  async connectedCallback() {
    const template = document.getElementById("student-dashboard-template");
    const content = template.content.cloneNode(true);

    this.section.replaceChildren(content);

    const kanban = this.section.querySelector("student-kanban");

    kanban.addEventListener("tasks-updated", async () => {
      const tasks = await TaskService.getTasks();

      this.renderTodayTasks(tasks);

      const history = this.section.querySelector("student-history");

      history.renderHistory(tasks);
    });

    try {
      const tasks = await TaskService.getTasks();

      this.renderTodayTasks(tasks);
    } catch (error) {
      console.error(error);

      const taskList = this.section.querySelector(".today-task-list");

      taskList.innerHTML = `
        <p class="today-empty">Unable to load today’s tasks.</p>
      `;
    }
  }

  renderTodayTasks(tasks) {
    const newestDate = tasks.reduce((latestDate, task) => {
      return task.assignedDate > latestDate ? task.assignedDate : latestDate;
    }, "");

    const todayTasks = tasks.filter((task) => {
      return task.assignedDate === newestDate;
    });

    const taskCount = this.section.querySelector(".task-count");
    const taskList = this.section.querySelector(".today-task-list");

    taskCount.textContent = `${todayTasks.length} tasks`;

    taskList.innerHTML = todayTasks
      .map((task) => {
        const categoryLabel = task.category === "dsa" ? "DSA" : "Aptitude";

        return `
        <article class="today-task">
          <div class="task-copy">
            <p class="task-category task-category--${task.category}">
              ${categoryLabel}
            </p>
            <h3>${task.title}</h3>
            <p>${task.description}</p>
          </div>

          <a
            class="task-link"
            href="${task.link}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open task
          </a>
        </article>
      `;
      })
      .join("");
  }
}

customElements.define("student-dashboard", StudentDashboard);
