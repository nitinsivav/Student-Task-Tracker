import AuthService from "../services/AuthService.js";

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

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = form.elements.username.value;
      const password = form.elements.password.value;
      const message = this.section.querySelector(".auth-message");

      try {
        const isAuthenticated = await AuthService.auth(
          "teacher",
          username,
          password,
        );

        if (isAuthenticated) {
          message.textContent = "Teacher credentials verified.";
          message.dataset.status = "success";
          this.dispatchEvent(
            new CustomEvent("auth-success", {
              detail: { role: "teacher" },
              bubbles: true,
              composed: true,
            }),
          );
          return;
        }

        message.textContent = "Invalid username or password.";
        message.dataset.status = "error";
      } catch (error) {
        message.textContent = "Unable to check credentials. Please try again.";
        message.dataset.status = "error";
        console.error(error);
      }
    });
  }
}

customElements.define("teacher-sign-in", TeacherSignIn);
