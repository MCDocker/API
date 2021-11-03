import { Request, Response } from 'express';
import MicrosoftAuth from '../../external/MicrosoftAuth';
import Route from '../../Route';
import ErrorCode from '../../utils/ErrorCode';
import RequestResponse from '../../utils/Response';

class MicrosoftAuthRoute extends Route {
    init(req: Request, res: Response) {
        if (req.query.code == (undefined || null)) return res.json(new RequestResponse('Code is invalid', false, ErrorCode.MALFORMED));

        MicrosoftAuth.codeToToken(String(req.query.code))
            .then((data: object) => res.json(new RequestResponse('Successfully converted code to token', true, -1, data)))
            .catch((err) => res.json(new RequestResponse('Error', false, ErrorCode.UNKNOWN, err)));
    }

    constructor() {
        super({
            name: 'MicrosoftAuth',
            url: 'auth/microsoft',
            method: 'post',
        });
    }
}

export default new MicrosoftAuthRoute();
