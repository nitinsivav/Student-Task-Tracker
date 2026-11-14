export class SignIn extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });

    const styles = document.createElement("style");
    this.root.appendChild(styles);

    this.section = document.createElement("section");
    this.root.appendChild(this.section);

    async function loadCSS() {
      const request = await fetch("/js/components/SignIn.css");
      styles.textContent = await request.text();
    }

    loadCSS();
  }

  connectedCallback() {
    const template = document.getElementById("sign-in-template");
    const content = template.content.cloneNode(true);

    this.section.replaceChildren(content);

    const loginButtons = this.section.querySelectorAll(".login-option");

    loginButtons.forEach((button) => {
    button.addEventListener("click", () => {
        this.handleRoleSelection(button.dataset.role);
    });
    });

  }

  handleRoleSelection(role) {
  this.dispatchEvent(
    new CustomEvent("role-selected", {
      detail: { role },
      bubbles: true,
      composed: true
    })
  );
}
}

customElements.define("sign-in", SignIn);