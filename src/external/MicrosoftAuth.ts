import axios from 'axios';

class MicrosoftAuth {
    public codeToToken(code: string) {
        return new Promise((resolve, reject) => {
            axios.post(
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
            ).then((data) => resolve(data.data))
                .catch((err) => reject(err));
        });
    }
}

export default new MicrosoftAuth();
