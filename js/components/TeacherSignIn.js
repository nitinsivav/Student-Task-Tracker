export class TeacherSignIn extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });

    const styles = document.createElement("style");
    this.root.appendChild(styles);

    this.section = document.createElement("section");
    this.root.appendChild(this.section);

    async function loadCSS() {
      const request = await fetch("/js/components/BaseSignIn.css");
      styles.textContent = await request.text();
    }

    loadCSS();
  }

  connectedCallback() {
    const template = document.getElementById("teacher-sign-in-template");
    const content = template.content.cloneNode(true);

    this.section.replaceChildren(content);

    const form = this.section.querySelector(".auth-form");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  }
}

customElements.define("teacher-sign-in", TeacherSignIn);