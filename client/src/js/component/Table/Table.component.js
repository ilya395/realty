export const simpleRowtemplate = data => {
  const { id, number, square, status } = data;
  return `
    <tr data-row="${id}">
      <td>${number}</td>
      <td>${square}</td>
      <td>${status}</td>
      <td class="table-section__buttons-cell">
        <button class="waves-effect waves-light btn" data-object="edit" data-id="${id}">
          <i class="material-icons">edit</i>
        </button>
        <button class="waves-effect waves-light btn" data-object="delete" data-id="${id}">
          <i class="material-icons">delete</i>
        </button>
      </td>
    </tr>
  `;
}

export class Table {
  constructor(object) {
    this.DOMUrl = object.DOMUrl;
    this.template = object.template || simpleRowtemplate;
    this.data = object.data;

    this._addRow = this._addRow.bind(this);
  }

  _getTable() {
    return document.querySelector(this.DOMUrl);
  }

  _getCurrentData() {
    const items = this._getTable().querySelectorAll("[data-row]");
    const array = [];
    items.forEach(item => array.push({
      id: +item.dataset["data-row"],
      elem: item
    }));
    return array;
  }

  _addRow(datas) {
    if (this.data && this.data.statuses) {
      const { id, number, square, status_id } = datas;
      const statusObj = this.data.statuses.find(item => +item.id === +status_id)
      this._getTable().insertAdjacentHTML("afterbegin", this.template({
        id,
        number,
        square,
        status: statusObj.name,
      }));
    } else {
      window.M.toast({html: 'Нет данных по статусам или они некорректны!'})
    }

  }

  async _getNewData() {
    const request = await fetch("/api/objects");
    const items = await request.json();
    return items;
  }

  async update() {
    const currentData = await this._getCurrentData();
    currentData.forEach(item => item.elem.remove());

    const newData = await this._getNewData();
    // let currentData = await this._getCurrentData();
    // // что удалено
    // currentData.forEach(async item => {
    //   const find = newData.find(elem => +elem.id === +item.id);
    //   if (!find) {
    //     await document.querySelector(`[data-row="${item.id}"]`).remove();
    //   }
    // });
    // // что добавлено
    // currentData = await this._getCurrentData();
    // newData.forEach(item => {
    //   const find = currentData.find(elem => +elem.id === +item.id);
    //   if (!find) {
    //     this._addRow(item);
    //   }
    // })
    newData.forEach(item => {
      this._addRow(item);
    })
  }

  init() {}
}