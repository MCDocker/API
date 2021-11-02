import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Route from '../../Route';
import ErrorCode from '../../utils/ErrorCode';
import RequestResponse from '../../utils/Response';
import { knex } from '../..';

class EditAccountRoute extends Route {
    init(req: Request, res: Response) {
        if (req.body.token == (undefined || 'undefined' || 'null' || null || '')) return res.status(400).json(new RequestResponse('Token is invalid', false, ErrorCode.INVALID_CREDENTIALS));

        knex('users').select('*').where({ token: req.body.token })
            .then((finished) => {
                if (finished[0] == null || finished[0] == undefined) {
                    return res.status(400).json(new RequestResponse('Invalid token', false, ErrorCode.INVALID_CREDENTIALS));
                }

                interface ISettings {
                    username?: string,
                    password?: string,
                    mc_id?: string,
                    dc_id?: string,
                    token?: string,
                }

                const settingsToChange: ISettings = {};

                if (req.body.hasOwnProperty('username')) { settingsToChange.username = req.body.username; }
                if (req.body.hasOwnProperty('password')) {
                    const token = jwt.sign({
                        data: {
                            password: req.body.password,
                            created: Date.now(),
                        },
                    }, process.env.TOKEN, {
                        expiresIn: '60d',
                    });

                    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

                    settingsToChange.password = hashedPassword;
                    settingsToChange.token = token;
                }

                knex('users').where({ token: req.body.token })[0].update(settingsToChange)
                    .then((done) => {
                        res.status(201).json(new RequestResponse('Changed settings', true, -1));
                        console.log(done);
                        console.log(settingsToChange);
                    });
            })
            .catch((err) => res.status(500).json(new RequestResponse('An internal server error has occurred', false, ErrorCode.UNKNOWN)));
    }

    constructor() {
        super({
            name: 'EditAccount',
            url: 'auth/edit',
            method: 'post',
        });
    }
}

export default new EditAccountRoute();
