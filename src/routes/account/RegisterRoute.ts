import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Route from '../../Route';
import ErrorCode from '../../utils/ErrorCode';
import RequestResponse from '../../utils/Response';
import { Account } from '../../interfaces/Account';
import { knex } from '../..';

class RegisterRoute extends Route {
    init(req: Request, res: Response) {
        if (req.body.username == ('undefined' || 'null' || null || undefined || '')) return res.status(400).json(new RequestResponse('Username is invalid', false, ErrorCode.INVALID_CREDENTIALS));
        if (req.body.password == ('undefined' || 'null' || null || undefined || '')) return res.status(400).json(new RequestResponse('Password is invalid', false, ErrorCode.INVALID_CREDENTIALS));

        knex('users').select('*').where({ username: req.body.username })
            .then((finished) => {
                if (finished[0] != null || finished[0] != undefined) {
                    return res.status(400).json(new RequestResponse(`Account with the username '${req.body.username}' already exists`, false, ErrorCode.DUPLICATE));
                }

                const token = jwt.sign({
                    data: {
                        password: req.body.password,
                        created: Date.now(),
                    },
                }, process.env.TOKEN, {
                    expiresIn: '60d',
                });

                const hashedPassword = bcrypt.hashSync(req.body.password, 10);

                const account: Account = {
                    username: req.body.username,
                    password: hashedPassword,
                    creation_date: String(Math.floor(Date.now() / 1000)),
                    token,
                };

                knex('users').select('*').insert(account)
                    .then((finished) => {

                    })
                    .catch((err) => console.error(err));

                res.status(201).json(new RequestResponse('Created new account', true, -1));
            })
            .catch((err) => res.status(500).json(new RequestResponse('An internal server error has occurred', false, ErrorCode.UNKNOWN)));
    }

    constructor() {
        super({
            name: 'Register',
            url: 'auth/register',
            method: 'post',
        });
    }
}

export default new RegisterRoute();
