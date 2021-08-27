import { DialogModal, LogoutButton, ObjectForm } from "../../component";
import { Table } from "../../component/Table/Table.component";

export class MainClass {
  async init() {
    console.log("main")

    const req = await fetch("/api/statuses");
    const statuses = await req.json();

    const logoutBtn = new LogoutButton({
      DOMUrl: "#logout"
    });
    logoutBtn.init();

    const table = new Table({
      DOMUrl: "#table-body",
      data: {
        statuses
      }
    });

    const addNewObjectDialogModal = new DialogModal({
      DOMUrl: "#add-new-object",
      data: {
        title: "Добавить объект",
        component: new ObjectForm({
          name: "form",
          container: ".modal__component",
          data: {
            data: {
              statuses: statuses,
              number: "",
              square: "",
              status: "",
              id: ""
            },
            url: "/api/objects",
            method: "PUT",
            callback: () => {
              table.update()
            }
          },
        })
      }
    });
    addNewObjectDialogModal.init();

    document.addEventListener("click", async event => {
      if (event.target.dataset.object && event.target.dataset.id) {
        if (event.target.dataset.object === "edit") {
          const request = await fetch("/api/objects");
          const objects = await request.json();
          const obj = objects.find(item => +item.id === +event.target.dataset.id);
          const editObjectDialogModal = new DialogModal({
            DOMUrl: null,
            data: {
              title: "Pедактировать объект",
              component: new ObjectForm({
                name: "form",
                container: ".modal__component",
                data: {
                  data: {
                    statuses: statuses,
                    number: obj.number,
                    square: obj.square,
                    status: obj.status_id,
                    id: obj.id
                  },
                  url: "/api/objects",
                  method: "POST",
                  callback: () => {
                    table.update()
                  }
                }
              })
            }
          });
          editObjectDialogModal.open();
        }
        if (event.target.dataset.object === "delete") {
          const request = await fetch("/api/objects");
          const objects = await request.json();
          const obj = objects.find(item => +item.id === +event.target.dataset.id)
          // const makeDeleteRequest = await fetch("/api/objects", {
          //   methis: "DELETE",
          //   headers: {
          //     "Content-Type": "application/json;charset=utf-8"
          //   },
          //   body: JSON.stringify({id: event.target.dataset.id})
          // });
          // const readResponseDeleterequest = await makeDeleteRequest
          const deleteObjectDialogModal = new DialogModal({
            DOMUrl: null,
            data: {
              title: "Удалить объект",
              component: new ObjectForm({
                name: "form",
                container: ".modal__component",
                data: {
                  data: {
                    id: obj.id
                  },
                  url: "/api/objects",
                  method: "DELETE",
                  callback: () => {
                    table.update()
                  },
                  newForm: true
                },
              })
            }
          });
          deleteObjectDialogModal.open();
        }
      }
    });
  }
}