import { Request, Response } from 'express';
import ContainerModel from '../../models/ContainerModel';
import sendResponse from '../../RequestResponse';
import Route, { RouteOptions } from '../../Route';
import HttpStatusCode from '../../utils/HttpStatusCode';
import Mongo from '../../utils/Mongo';

class CreateContainer extends Route {
    opts: RouteOptions = {
        url: 'containers/create',
        method: 'post',
    }

    async init(req: Request, res: Response) {
        const contRequest: ContainerModel = req.body;

        // this is scuffed asf
        if (!contRequest.client.dataUrl.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi)) {
            return sendResponse(res, 'Couldn\'t insert document. dataUrl is not a valid url', HttpStatusCode.BAD_REQUEST);
        }

        Mongo.collections.containers.insertOne(contRequest)
            .then((data) => sendResponse(res, 'Inserted document', 200))
            .catch((err) => sendResponse(res, 'Couldn\'t insert document.', HttpStatusCode.BAD_REQUEST, err));
    }
}

export default new CreateContainer();
