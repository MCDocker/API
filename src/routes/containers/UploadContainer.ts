import { Request, Response } from 'express';
import { knex } from '../..';
import { getAccount, getAccountByToken, PublicAccount } from '../../interfaces/Account';
import Container from '../../interfaces/Container';
import Route from '../../Route';
import ErrorCode from '../../utils/ErrorCode';
import RequestResponse from '../../utils/Response';
import { generator } from '../../utils/Snowflake';

interface Body {
    user_token: string,
    container: Container,
}

class UploadContainerRoute extends Route {
    init(req: Request, res: Response) {
        const body: Body = {
            user_token: req.body.token,
            container: {
                name: req.body.name,
                id: generator.nextId().toString(),
                client: req.body.client,
                mods: req.body.mods,
            },
        };

        if (body.user_token == (undefined || null)) return res.status(400).json(new RequestResponse('User Token not provided or invalid', false, ErrorCode.NOT_AUTHENTICATED));
        if (body.container.name == (undefined || null) || body.container.name.length < 3) return res.status(400).json(new RequestResponse('Container Name does not fit regulations', false, ErrorCode.MALFORMED));
        if (body.container.mods == (undefined || null)) return res.status(400).json(new RequestResponse('Mods not present', false, ErrorCode.MALFORMED));
        if (body.container.client == (undefined || null)) return res.status(400).json(new RequestResponse('Client not present', false, ErrorCode.MALFORMED));

        getAccountByToken({ token: body.user_token })
            .then((account: any) => {
                knex('containers')
                    .insert({
                        id: body.container.id,
                        name: body.container.name,
                        client: JSON.stringify(body.container.client),
                        mods: JSON.stringify(body.container.mods),
                        user_id: account.additionalContent.id,
                    })
                    .then((finished) => {
                        res.status(201).json(new RequestResponse('Successfully uploaded container', true));
                    });
            })
            .catch((err) => res.status(400).json(err));
    }

    constructor() {
        super({
            name: 'UploadContainer',
            url: 'containers/upload',
            method: 'post',
        });
    }
}

export default new UploadContainerRoute();
