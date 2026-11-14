import "../components/SignIn.js";
import "../components/StudentSignIn.js";
import "../components/TeacherSignIn.js";

const Router = {
    init: () => {
    window.addEventListener("popstate", () => {
    Router.go(window.location.pathname, false);
    });

    const initialPath =
    window.location.pathname === "/"
        ? "/sign-in"
        : window.location.pathname;

    if (window.location.pathname === "/") {
    window.history.replaceState({}, "", initialPath);
    }

    Router.go(initialPath, false);
    },

  go: (path, addToHistory = true) => {
    console.log(`Going to ${path}`);

    if (addToHistory) {
      window.history.pushState({}, "", path);
    }

    const app = document.querySelector("#app");
    let pageEl = null;

    switch (path) {
      case "/":
      case "/sign-in":
        pageEl = document.createElement("sign-in");
        pageEl.addEventListener("role-selected", (event) => {
            const role = event.detail.role;
            Router.go(`/sign-in/${role}`);
        });
        break;
      case "/sign-in/teacher":
        pageEl = document.createElement("teacher-sign-in");
        break;
      case "/sign-in/student":
        pageEl = document.createElement("student-sign-in");
        break;

      default:
        app.innerHTML = "<p>Page not found.</p>";
    }
    if(pageEl) {
        app.replaceChildren(pageEl);
        window.scrollTo(0, 0);
    }
  }
};

export default Router;