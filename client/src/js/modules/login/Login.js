// class DefaultForm {
//   constructor(object) {
//     this.DOMUrl = object.DOMUrl;

import { defaultForm } from "../../component";

//     this._getContainer = this._getContainer.bind(this);
//     this._request = this._request.bind(this);
//   }

//   _getContainer() {
//     return document.querySelector(this.DOMUrl);
//   }

//   _request() {
//     const formData = new FormData(document.forms["login-form"]);
//   }

//   init() {
//     this._getContainer().addEventListener("submit", (event) => {
//       event.preventDefault();
//       this._request();
//     });
//   }
// }

// export { DefaultForm }

export class LoginClass {
  init() {
    console.log("login")
    // const loginForm = new defaultForm({
    //   DOMUrl: "#login-form"
    // });
  }
}