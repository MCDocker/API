import axios from 'axios';
import { Request, Response } from 'express';

export default class MicrosoftAuth {
    url = `https://login.live.com/oauth20_authorize.srf?client_id=${process.env.CLIENT_ID}&response_type=code&scope=XboxLive.signin%20offline_access`;

    constructor(private req: Request, private res: Response) {}

    public redirect() {
        this.res.redirect(this.url);
    }

    public codeToToken(code: string) {
        return new Promise((resolve) => {
            axios
                .post(
                    'https://login.live.com/oauth20_token.srf',
                    `client_id=${process.env.CLIENT_ID}
                &client_secret=${process.env.CLIENT_SECRET}
                &code=${code}
                &grant_type=authorization_code`,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    },
                )
                .then((data) => resolve(data.data))
                .catch((err) => resolve(err));
        });
    }

    public authWithXBL(accessToken: string) {
        return new Promise< {
            'IssueInstant': string,
            'NotAfter': string,
            'Token': string,
            'DisplayClaims': {
                'xui': [{ 'uhs': string }]
            }
        }>((resolve, reject) => {
            axios.post(
                'https://user.auth.xboxlive.com/user/authenticate', {
                    Properties: {
                        AuthMethod: 'RPS',
                        SiteName: 'user.auth.xboxlive.com',
                        RpsTicket: `d=${accessToken}`,
                    },
                    RelyingParty: 'http://auth.xboxlive.com',
                    TokenType: 'JWT',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                },
            )
                .then((data) => resolve(data.data))
                .catch((err) => reject(err));
        });
    }

    public authWithXSTS(xblToken: string) {
        return new Promise<{
            Token?: string,
            DisplayClaims?: {
                'xui': [{ 'uhs': string }]
            },
            XErr?: number,
        }>((resolve, reject) => {
            axios.post(
                'https://xsts.auth.xboxlive.com/xsts/authorize',
                {
                    Properties: {
                        SandboxId: 'RETAIL',
                        UserTokens: [`${xblToken}`],
                    },
                    RelyingParty: 'rp://api.minecraftservices.com/',
                    TokenType: 'JWT',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                },
            )
                .then((data) => resolve(data.data))
                .catch((err) => reject(err));
        });
    }

    public authWithMC(userhash: string, xstsToken: string) {
        return new Promise<{
            'access_token' : string
        }>((resolve, reject) => {
            axios.post(
                'https://api.minecraftservices.com/authentication/login_with_xbox',
                { identityToken: `XBL3.0 x=${userhash};${xstsToken}` },
            )
                .then((data) => resolve(data.data))
                .catch((err) => reject(err));
        });
    }

    public getProfile(accessToken: string) {
        return new Promise<{
            'id'?: string,
            'name'?: string,
            'skins'?: [{
                'id': string,
                'state': string,
                'url': string,
                'variant': string,
                'alias': string
            }],
            'capes'?: [any],
            'errorType'?: string,
            'error'?: string,
            'errorMessage'?: string,
            'developerMessage'?: string
        }>((resolve, reject) => {
            axios.get('https://api.minecraftservices.com/minecraft/profile', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((data) => resolve(data.data))
                .catch((err) => reject(err)); // Either has Minecraft from Xbox Game Pass and hasn't logged in not even once into the Minecraft Launcher or just doesn't own the game lmfao
        });
    }
}
