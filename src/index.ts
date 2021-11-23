import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import Knex from 'knex';
import path from 'node:path';
import RouteHandler from './RouteHandler';

export const app = express();
export const PORT = 6167 | process.env.PORT;
export const DOCS = 'https://github.com/MCDocker/MCDocker';

export const knex = Knex({
    client: 'sqlite3',
    connection: { filename: path.join(__dirname, '..', 'database.sqlite') },
    useNullAsDefault: true,
});

knex.schema.createTable('containers', (table) => {
    table.string('id');
    table.string('name');
    table.string('client');
    table.string('mods');
    table.string('user_id');
}).then(() => console.log('Created table containers')).catch(() => {});

knex.schema.createTable('users', (table) => {
    table.string('username');
    table.string('password');
    table.string('token');
    table.string('creation_date');
    table.string('mc_id').nullable();
    table.string('dc_id').nullable();
    table.increments('id');
}).then(() => console.log('Created table users')).catch(() => {});

app.use(bodyParser());
app.get('/', (req, res) => res.redirect(DOCS));

RouteHandler.registerRoutes().then(() => RouteHandler.handleRoutes().then(() => app.listen(PORT, () => console.log(`App listening on ${PORT}`))));
