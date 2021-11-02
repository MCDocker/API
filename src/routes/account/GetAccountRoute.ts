import { Request, Response } from 'express';
import Route from '../../Route';
import ErrorCode from '../../utils/ErrorCode';
import RequestResponse from '../../utils/Response';
import { getAccount } from '../../interfaces/Account';

class GetAccountRoute extends Route {
    init(req: Request, res: Response) {
        if (req.body.username == ('undefined' || 'null' || null || undefined || '')) return res.status(400).json(new RequestResponse('Username is invalid', false, ErrorCode.INVALID_CREDENTIALS));
        if (req.body.password == ('undefined' || 'null' || null || undefined || '')) return res.status(400).json(new RequestResponse('Password is invalid', false, ErrorCode.INVALID_CREDENTIALS));

        getAccount(req.body)
            .then((account) => res.status(200).json(account))
            .catch((err) => res.status(400).json(err));
    }

    constructor() {
        super({
            name: 'GetAccount',
            url: 'auth/get',
            method: 'post',
        });
    }
}

export default new GetAccountRoute();
