import TaskService from "../services/TaskService.js";

export class StudentHistory extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });

    const styles = document.createElement("style");
    this.root.appendChild(styles);

    this.section = document.createElement("section");
    this.root.appendChild(this.section);

    async function loadCSS() {
      const request = await fetch("/js/components/StudentHistory.css");
      styles.textContent = await request.text();
    }

    loadCSS();
  }

  async connectedCallback() {
    const template = document.getElementById("student-history-template");
    const content = template.content.cloneNode(true);

    this.section.replaceChildren(content);

    try {
      const tasks = await TaskService.getTasks();

      this.renderHistory(tasks);
    } catch (error) {
      console.error(error);

      const historyGroups = this.section.querySelector(".history-groups");

      historyGroups.innerHTML = `
        <p class="history-empty">Unable to load task history.</p>
      `;
    }
  }

  renderHistory(tasks) {
    const newestDate = tasks.reduce((latestDate, task) => {
      return task.assignedDate > latestDate
        ? task.assignedDate
        : latestDate;
    }, "");

    const previousTasks = tasks.filter((task) => {
      return task.assignedDate !== newestDate;
    });

    const tasksByDate = previousTasks.reduce((groups, task) => {
      if (!groups[task.assignedDate]) {
        groups[task.assignedDate] = [];
      }

      groups[task.assignedDate].push(task);

      return groups;
    }, {});

    const dates = Object.keys(tasksByDate).sort((firstDate, secondDate) => {
      return secondDate.localeCompare(firstDate);
    });

    const historyGroups = this.section.querySelector(".history-groups");

    if (dates.length === 0) {
      historyGroups.innerHTML = `
        <p class="history-empty">No previous tasks yet.</p>
      `;
      return;
    }

    historyGroups.innerHTML = dates.map((date) => {
      const dateTasks = tasksByDate[date];
      const taskLabel = dateTasks.length === 1 ? "task" : "tasks";

      return `
        <section class="history-group">
          <header class="history-date">
            <h3>${this.formatDate(date)}</h3>
            <p>${dateTasks.length} ${taskLabel}</p>
          </header>

          <div class="history-cards">
            ${dateTasks.map((task) => {
              const categoryLabel = task.category === "dsa"
                ? "DSA"
                : "Aptitude";

              const statusLabel = {
                "not-done": "Not done",
                "in-progress": "In progress",
                completed: "Completed"
              }[task.status];

              return `
                <article class="history-card">
                  <div>
                    <p class="task-type task-type--${task.category}">
                      ${categoryLabel} · ${statusLabel}
                    </p>
                    <h4>${task.title}</h4>
                    <p>${task.description}</p>
                  </div>

                  <a
                    href="${task.link}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                </article>
              `;
            }).join("")}
          </div>
        </section>
      `;
    }).join("");
  }

  formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric"
    }).format(date);
  }
}

customElements.define("student-history", StudentHistory);