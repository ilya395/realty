import { objectsController } from '../../objects/objects.controller.js';
import { statusController } from '../../statuses/statuses.controller.js';

class ObjectsComplexController {
  async getPublicObjects(request, response) {
    if(!request.body) return response.sendStatus(400);
    const statuses = await statusController.getStatuses();
    const objects = await objectsController.getObjects();
    const data = objects.map(item => {
      return {
        id: item.id,
        square: item.square,
        number: item.number,
        statusId: statuses.find(j => j.id === item.status_id)
      }
    });
    response.json({ ...data })
  }
}

export const objectsComplexController = new ObjectsComplexController();