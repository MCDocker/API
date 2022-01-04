import { readFileSync } from 'fs';
import * as mongo from 'mongodb';
import { join } from 'path';

export interface MongoCollections {
    containers?: mongo.Collection,
    users?: mongo.Collection
}

class Mongo {
    collections: MongoCollections = {};

    public connect() {
        const mongoValidator = JSON.parse(readFileSync(join(__dirname, '..', '..', 'mongo_validation.json'), { encoding: 'utf8' }));

        return new Promise((resolve, reject) => {
            const client = new mongo.MongoClient(String(process.env.DB_CONN));

            client.connect()
                .then(() => {
                    const db: mongo.Db = client.db(String(process.env.DB_NAME));

                    this.collections.containers = db.collection('containers');
                    this.collections.users = db.collection('users');

                    db.command({
                        collMod: 'containers',
                        validator: mongoValidator.containers.validation,
                    });

                    db.command({
                        collMod: 'users',
                        validator: mongoValidator.users.validation,
                    });

                    console.log(`Connected to MongoDB at ${String(process.env.DB_CONN)}`);
                    resolve({});
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

export default new Mongo();