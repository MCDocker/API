import * as express from 'express';
import HttpStatusCode from './utils/HttpStatusCode';

class RequestResponse {
    constructor(public res: express.Response, public message: string, public code?: HttpStatusCode, public content?: object) {
        res.status(code).send({
            message,
            content,
            success: !(code >= 300),
        });
    }
}

const sendResponse = (res: express.Response, message: string, code?: HttpStatusCode, content?: object) => {
    const respons = new RequestResponse(res, message, code, content);
};

export default sendResponse;
