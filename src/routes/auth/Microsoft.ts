import { Request, Response } from 'express';
import Account from '../../accounts/Account';
import MicrosoftAuth from '../../accounts/MicrosoftAuth';
import sendResponse from '../../RequestResponse';
import Route, { RouteOptions } from '../../Route';
import HttpStatusCode from '../../utils/HttpStatusCode';

class Microsoft extends Route {
    opts: RouteOptions = {
        method: 'get',
        url: 'auth/microsoft',
    };

    async init(req: Request, res: Response) {
        const auth = new MicrosoftAuth(req, res);

        if (req.query.code == (undefined || null)) return auth.redirect();

        const token: any = await auth.codeToToken(String(req.query.code));
        if (!token.access_token) return sendResponse(res, 'Code is invalid/expired', HttpStatusCode.BAD_REQUEST);

        const xblToken = await (await auth.authWithXBL(String(token.access_token))).Token;
        const xsts = await auth.authWithXSTS(xblToken);

        switch (xsts.XErr) {
            default: break;
            case 2148916233:
                return sendResponse(res, 'This account doesn\' have an Xbox Account. No idea how you did this one buddy', HttpStatusCode.BAD_REQUEST);
            case 2148916235:
                return sendResponse(res, 'This account is from a country where Xbox Live is not available and/or banned');
            case 2148916238:
                return sendResponse(res, 'This account is a child (under 18) and cannot proceed unless the account is added to a Family by an adult.');
        }
        const mcToken = await (await auth.authWithMC(xsts.DisplayClaims.xui[0].uhs, xsts.Token)).access_token;
        const profile = await auth.getProfile(mcToken);

        if (profile.error) return sendResponse(res, 'Couldn\'t get your profile. Possible solutions is to login to the Minecraft Launcher and try again else double check you own the real Minecraft', HttpStatusCode.BAD_REQUEST);

        if (!(await Account.exists(profile.id)).valueOf()) {
            await Account.create(profile.name, profile.id);
        } else {
            await Account.update(profile.id, { name: profile.name });
        }

        res.send(profile);
    }
}

export default new Microsoft();
