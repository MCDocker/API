import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import RouteHandler from './RouteHandler';
import Mongo from './utils/Mongo';

export const app = express();
export const PORT = 6167 || process.env.PORT;
export const DOCS = 'https://github.com/MCDocker/MCDocker-Core';

app.use(bodyParser());
app.get('/', (req, res) => res.redirect(DOCS));

const init = async () => {
    await Mongo.connect();
    await RouteHandler.registerRoutes();
    await RouteHandler.handleRoutes();
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};

init();
