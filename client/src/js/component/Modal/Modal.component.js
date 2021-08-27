import "./Modal.component.scss";

export const SimpleModalTemplate = (data) => {
  const { title, component = false, dialog = false } = data;
  return `
    <div class="modal">
      <div class="modal__close-btn" data-object="close">
      </div>
      <div class="modal__content">
        ${
          title ?
            `
              <div class="modal__title">
                ${title}
              </div>
            ` :
            ''
        }
        ${
          component ?
            `
              <div class="modal__component">
              </div>
            ` :
            ''
        }
      </div>
      ${
        dialog ?
          `
            <div class="modal__footer">
              <button class="modal__dialog-btn waves-effect waves-light btn" data-object="agree">Сохранить</button>
              <button class="modal__dialog-btn waves-effect waves-light btn" data-object="close">Отмена</button>
            </div>
          ` :
          ''
      }
    </div>
  `;
}

export class SimpleModal {
  constructor(object) {
    this.DOMUrl = object.DOMUrl;
    this.template = object.template || SimpleModalTemplate;
    this.data = object.data;

    this.target = null;
    this.element = null;
    this._onOffHandler = this._onOffHandler.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.dialog = false;
  }

  create() {
    this.element = document.createElement('div');
    this.element.classList.add('modal-container');
    this.element.insertAdjacentHTML("beforeend", this.template({
      title: this.data.title,
      component: (this.data.component !== null && typeof this.data.component !== 'undefined') ? true : false,
      dialog: this.dialog,
    }));

    document.body.append(this.element);
  }

  _onOffHandler(event) {
    if (event.target.dataset.object && event.target.dataset.object === "close") {
      this.close();
    }
  }

  on() {
    console.log("on")
    document.addEventListener("click", this._onOffHandler);
  }

  off() {
    console.log("off")
    document.removeEventListener("click", this._onOffHandler);
  }

  delete() {
    this.element.remove();
  }

  open() {
    this.create();
    this.on();
    if (this.data && this.data.component) {
      this.data.component.init();
    }
  }

  close() {
    if (this.data && this.data.component) {
      this.data.component.clear();
    }
    this.off();
    this.delete();
  }

  init() {
    if (this.DOMUrl) {
      this.target = document.querySelector(this.DOMUrl);
      this.target.addEventListener("click", this.open);
    }
  }

  clear() {
    if (this.data && this.data.component) {
      this.data.component.clear();
    }
    this.off();
    this.target.removeEventListener("click", this.open);
  }
}

export class DialogModal extends SimpleModal {
  constructor(object) {
    super(object);

    this.dialog = true;
    this.dialog = object.data && object.data.dialog ? object.data.dialog : true;

    this._handleMove = this._handleMove.bind(this);
    this._onMove = this._onMove.bind(this);
    this._offMove = this._offMove.bind(this);
  }

  _onMove() {
    document.addEventListener("click", this._handleMove);
  }

  _offMove() {
    document.removeEventListener("click", this._handleMove);
  }

  _handleMove(event) {
    if (event.target.dataset.object && event.target.dataset.object === "agree") {
      if (this.data && this.data.component) {
        try {
          this.data.component.move();
          this.close();
        } catch(e) {
          window.M.toast({html: 'Callback problem!'});
        }
      } else {
        window.M.toast({html: 'Not callback!'});
      }
    }
  }

  open() {
    super.open();
    if (this.data && this.data.component) {
      this._onMove();
    }
  }

  close() {
    if (this.data && this.data.component) {
      this._offMove();
    }
    super.close();
  }
}