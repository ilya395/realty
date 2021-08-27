import "./ObjectForm.component.scss";

export const defaultForm = datas => {
  const { selfSubmit = false, data, newForm } = datas;
  return `
    <div class="form-container">
      <form id="form" name="form">
        ${
          !newForm ?
            `
              ${
                `
                  <div class="input-field">
                    <select name="status">
                      ${
                        data.statuses.map(item => `<option value="${item.id}" ${ data.status && +data.status === +item.id ? "selected" : "" }>${item.name}</option>`).join("")
                      }
                    </select>
                    <label for="square" class="active">Status</label>
                  </div>
                `
              }
            ` :
            ""
        }
        ${
          !newForm ?
            `
              <div class="input-field">
                <input id="number" name="number" type="number" class="validate" required value="${data && data.number ? data.number : ""}">
                <label for="number" ${data && data.number ? `class="active"` : ``}>Number</label>
              </div>
            ` :
            ``
        }
        ${
          !newForm ?
            `
              <div class="input-field">
                <input id="square" name="square" type="number" class="validate" required value="${data && data.square ? data.square : ""}">
                <label for="square" ${data && data.square ? `class="active"` : ``}>Square</label>
              </div>
            ` :
            ``
        }
        ${
          selfSubmit ?
            `
              <button class="form__submit-button waves-effect waves-light btn" data-object="submit">Отправить</button>
            ` :
            ""
        }
      </form>
    </div>
  `;
}

export class ObjectForm {
  constructor(object) {
    this.data = object.data;
    this.name = object.name;
    this.container = object.container;

    this.template = object.template || defaultForm;
    this.newForm = object.data.newForm || false;

    this.method = this.data.method || "POST";
    this.url = this.data.url;
    this.select = null;
    this.callback = this.data.callback;
    this.id = this.data.data.id ? this.data.data.id : null;

    this.move = this.move.bind(this);
    this._getFormElement = this._getFormElement.bind(this);
  }

  _getFormElement() {
    return document.forms[this.name];
  }

  _getForm() {
    return {
      number: this._getFormElement() && this._getFormElement().number ? this._getFormElement().number.value : null,
      square: this._getFormElement() && this._getFormElement().square ? this._getFormElement().square.value : null,
      statusId: this._getFormElement() && this._getFormElement().status ? this._getFormElement().status.value : null,
      id: this.id
    }
  }

  _create() {
    document.querySelector(this.container).insertAdjacentHTML("beforeend", this.template(this.data));
  }

  _request() {
    fetch(
      this.url,
      {
        method: this.method,
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(this._getForm())
      }
    )
      .then(response => response.json())
      .then(response => {
        if (response) {
          window.M.toast({html: 'Ok!'});
          if (this.callback) {
            this.callback();
          }
        } else {
          window.M.toast({html: 'Not Ok!'});
        }
      })
      .catch(() => window.M.toast({html: 'Error to request!'}))
  }

  move() {
    this._request();
  }

  init() {
    this._create();
  }

  clear() { }
}