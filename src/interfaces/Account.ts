import bcrypt from 'bcrypt';
import { knex } from '..';
import ErrorCode from '../utils/ErrorCode';
import RequestResponse from '../utils/Response';

export interface Account {
    token: string,
    username: string,
    password: string,
    creation_date: string,
    mc_id?: string,
    dc_id?: string,
}

export interface PublicAccount {
    username: string,
    creation_date: string,
    mc_id: string,
    dc_id: string,
    id: number,
    token?: string
}

export const getAccount = (body: { username: string, password: string, token?: string, }) => new Promise((resolve, reject) => {
    knex('users').select('*').where({ username: body.username })
        .then((finished) => {
            if (finished[0] == null || finished[0] == undefined) {
                return reject(new RequestResponse('No account found', false, ErrorCode.INVALID_CREDENTIALS));
            }

            const check = bcrypt.compareSync(body.password, finished[0].password);
            if (!check) return reject(new RequestResponse('Password is invalid', false, ErrorCode.INVALID_CREDENTIALS));

            const account: PublicAccount = {
                username: finished[0].username,
                creation_date: finished[0].creation_date,
                mc_id: finished[0].mc_id,
                dc_id: finished[0].dc_id,
                id: finished[0].id,
            };

            if (body.token) account.token = finished[0].token;

            resolve(new RequestResponse('Account found', true, -1, account));
        })
        .catch((err) => reject(new RequestResponse('An internal server error has occurred', false, ErrorCode.UNKNOWN)));
});

export const getAccountByToken = (body: { token: string }) => new Promise((resolve, reject) => {
    knex('users').select('*').where({ token: body.token })
        .then((finished) => {
            if (finished[0] == null || finished[0] == undefined) {
                return reject(new RequestResponse('No account found', false, ErrorCode.INVALID_CREDENTIALS));
            }

            const account: PublicAccount = {
                username: finished[0].username,
                creation_date: finished[0].creation_date,
                mc_id: finished[0].mc_id,
                dc_id: finished[0].dc_id,
                id: finished[0].id,
                token: finished[0].token,
            };

            resolve(new RequestResponse('Account found', true, -1, account));
        })
        .catch((err) => reject(new RequestResponse('An internal server error has occurred', false, ErrorCode.UNKNOWN)));
});
