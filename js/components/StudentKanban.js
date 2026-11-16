import TaskService from "../services/TaskService.js";

export class StudentKanban extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });

    const styles = document.createElement("style");
    this.root.appendChild(styles);

    this.section = document.createElement("section");
    this.root.appendChild(this.section);

    this.section.addEventListener("change", (event) => {
      if (!event.target.matches(".task-status")) {
        return;
      }

      this.handleStatusChange(event.target);
    });

    async function loadCSS() {
      const request = await fetch("/js/components/StudentKanban.css");
      styles.textContent = await request.text();
    }

    loadCSS();
  }

  async connectedCallback() {
    const template = document.getElementById("student-kanban-template");
    const content = template.content.cloneNode(true);

    this.section.replaceChildren(content);

    try {
      const tasks = await TaskService.getTasks();

      this.renderColumns(tasks);
    } catch (error) {
      console.error(error);

      const board = this.section.querySelector(".kanban-board");

      board.innerHTML = `
        <p class="kanban-empty">Unable to load the practice board.</p>
      `;
    }
  }

  async handleStatusChange(select) {
    try {
      await TaskService.updateTaskStatus(
        select.dataset.taskId,
        select.value
      );

      const tasks = await TaskService.getTasks();

      this.renderColumns(tasks);

      this.dispatchEvent(
        new CustomEvent("tasks-updated", {
          bubbles: true,
          composed: true
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  renderColumns(tasks) {
    const statuses = ["not-done", "in-progress", "completed"];

    statuses.forEach((status) => {
      const column = this.section.querySelector(
        `[data-status="${status}"]`
      );

      const statusTasks = tasks.filter((task) => {
        return task.status === status;
      });

      const count = column.querySelector("[data-status-count]");
      const cardList = column.querySelector("[data-status-list]");

      count.textContent = statusTasks.length;

      if (statusTasks.length === 0) {
        cardList.innerHTML = `
          <p class="kanban-empty">No tasks here.</p>
        `;
        return;
      }

      cardList.innerHTML = statusTasks.map((task) => {
        const categoryLabel = task.category === "dsa"
          ? "DSA"
          : "Aptitude";

        return `
          <article class="kanban-card">
            <p class="task-type task-type--${task.category}">
              ${categoryLabel}
            </p>
            <h4>${task.title}</h4>
            <p>${task.description}</p>

            <label class="status-control">
              Progress
              <select class="task-status" data-task-id="${task.id}">
                <option value="not-done" ${
                  task.status === "not-done" ? "selected" : ""
                }>
                  Not done
                </option>
                <option value="in-progress" ${
                  task.status === "in-progress" ? "selected" : ""
                }>
                  In progress
                </option>
                <option value="completed" ${
                  task.status === "completed" ? "selected" : ""
                }>
                  Completed
                </option>
              </select>
            </label>
          </article>
        `;
      }).join("");
    });
  }
}

customElements.define("student-kanban", StudentKanban);