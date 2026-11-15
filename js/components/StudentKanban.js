export class StudentKanban extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });

    const styles = document.createElement("style");
    this.root.appendChild(styles);

    this.section = document.createElement("section");
    this.root.appendChild(this.section);

    async function loadCSS() {
      const request = await fetch("/js/components/StudentKanban.css");
      styles.textContent = await request.text();
    }

    loadCSS();
  }

  connectedCallback() {
    const template = document.getElementById("student-kanban-template");
    const content = template.content.cloneNode(true);

    this.section.replaceChildren(content);
  }
}

customElements.define("student-kanban", StudentKanban);