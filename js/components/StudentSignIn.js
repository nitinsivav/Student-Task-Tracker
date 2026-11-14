import AuthService from "../services/AuthService.js";

export class StudentSignIn extends HTMLElement {
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
        const template = document.getElementById("student-sign-in-template");
        const content = template.content.cloneNode(true);

        this.section.replaceChildren(content);

        const form = this.section.querySelector(".auth-form");

        form.addEventListener("submit", async (e) =>{
            e.preventDefault(); 

            const username = form.elements.username.value;
            const password = form.elements.password.value;
            const messageEl = this.section.querySelector(".auth-message");
            
            try {
                const isAuthenticated = await AuthService.auth("student", username, password);
                if(isAuthenticated) {
                    messageEl.textContent = "Student Account Verified";
                    messageEl.dataset.status = "success";
                    return;
                }
                messageEl.textContent = "Invalid username or password";
                messageEl.dataset.status = "error";
            } catch (error) {
                console.error(error);
                messageEl.textContent = "An error occurred.";
                messageEl.dataset.status = "error";
            }
        });
    }
}

customElements.define("student-sign-in", StudentSignIn);