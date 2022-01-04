import { Request, Response } from 'express';
import Account from '../../accounts/Account';
import ContainerModel from '../../models/ContainerModel';
import User from '../../models/UserModel';
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
        if (!req.body.token) return sendResponse(res, 'Couldn\'t insert document. token is missing', HttpStatusCode.UNAUTHORIZED);

        const exists = await (await Account.existsQuery({ token: req.body.token })).valueOf();
        if (!exists) return sendResponse(res, 'Couldn\'t insert document. Provided token is invalid', HttpStatusCode.UNAUTHORIZED);

        const contRequest: ContainerModel = req.body.container;

        const user: User = await Account.get({ token: req.body.token });
        const uuid = user.minecraftId;

        // this is scuffed asf
        if (!contRequest.client.dataUrl.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi)) {
            return sendResponse(res, 'Couldn\'t insert document. dataUrl is not a valid url', HttpStatusCode.BAD_REQUEST);
        }

        contRequest.minecraftId = uuid;

        Mongo.collections.containers.insertOne(contRequest)
            .then((data) => sendResponse(res, 'Inserted document', 200))
            .catch((err) => sendResponse(res, 'Couldn\'t insert document.', HttpStatusCode.BAD_REQUEST, err));
    }
}

export default new CreateContainer();
