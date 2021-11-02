import { Request, Response } from 'express';
import Route from '../Route';

class StatusRoute extends Route {
    init(req: Request, res: Response) {
        res.json({
            api: 'ok',
            website: 'ok',
        });
    }

    constructor() {
        super({
            name: 'Status',
            url: 'status',
            method: 'get',
        });
    }
}

export default new StatusRoute();
