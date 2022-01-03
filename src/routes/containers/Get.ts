import { Response, Request } from 'express';
import ContainerModel from '../../models/ContainerModel';
import ModsModel from '../../models/ModsModel';
import Route, { RouteOptions } from '../../Route';
import Mongo from '../../utils/Mongo';

interface ContainerFilters {
    name?: string,
    id?: string,
    type?: string,
    version?: string,
    mods?: ModsModel[],
}

class GetContainers extends Route {
    opts: RouteOptions = {
        url: 'containers/get',
        method: 'get',
    }

    async init(req: Request, res: Response) {
        const filters = req.query.filters || {};
        const one = req.query.one || false;

        console.log(req.query);

        const documents = await Mongo.collections.containers.find<ContainerModel>({ filters }).limit(15).toArray();

        res.send(one ? documents[0] : documents);
    }
}

export default new GetContainers();
