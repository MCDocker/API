import { Request, Response } from 'express';
import { knex } from '../..';
import Route from '../../Route';
import { clamp } from '../../utils/MathUtils';

class GetContainersRoute extends Route {
    init(req: Request, res: Response) {
        interface ISettings {
            max?: number,
            name?: string,
            id?: string,
        }

        const settings: ISettings = {};

        settings.max = clamp(Number(req.query.max), 1, 50);
        settings.name = String(req.query.name);
        settings.id = String(req.query.id);

        const kn = knex('containers').limit(settings.max);

        if (settings.name != 'undefined') kn.where({ name: settings.name });
        if (settings.id != 'undefined') kn.where({ id: settings.id });

        kn.then((finished) => {
            res.json(finished);
        });
    }

    constructor() {
        super({
            name: 'GetContainers',
            url: 'containers',
            method: 'get',
        });
    }
}

export default new GetContainersRoute();
