export class LogoutButton {
  constructor(object) {
    this.DOMUrl = object.DOMUrl;
    this.urlToLogout = object.urlToLogout || "/logout";
    this.logout = false;

    this._getContainer = this._getContainer.bind(this);
    this._logoutHandler = this._logoutHandler.bind(this);
  }

  _getContainer() {
    return document.querySelector(this.DOMUrl);
  }

  _logoutHandler() {
    if (!this.logout) {

      this.logout = true;
    }

    console.log("logout")
    fetch(this.urlToLogout, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify({action: "logout"})
    })
      .then(response => response.json())
      .then(response => {
        if (response && response.location) {
          window.location = response.location;
        }
      })
      .catch(e => console.log(e))

  }

  init() {
    this._getContainer().addEventListener("click", this._logoutHandler);
  }
}