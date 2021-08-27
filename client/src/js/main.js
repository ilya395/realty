import '../sass/main.scss';

import { LoginClass } from "./modules/login/Login";
import { MainClass } from './modules/main/Main';

window.addEventListener("load", async () => {
  const url = new URL(window.location.href);
  switch (url.pathname) {
    case "/login":
      const loginClass = new LoginClass();
      loginClass.init();
      break;

    case "/":
      const mainClass = new MainClass();
      mainClass.init();
      break;

    default:
      console.log("go away!")
      break;
  }
});