import { ObjectId } from 'mongodb';
import Crypto from 'crypto';
import User, { UserType } from '../models/UserModel';
import Mongo from '../utils/Mongo';

class Accounts {
    public generateToken(uuid: string, time: string): string {
        const first = Buffer.from(uuid).toString('base64');
        const second = Buffer.from(time).toString('base64');
        const third = Crypto.createHmac('sha1', process.env.KEY).update(first + second).digest('hex');

        return `${first}.${second}.${third}`;
    }

    public async create(name: string, uuid: string) {
        const document: User = {
            name,
            created: String(Date.now()),
            minecraftId: uuid,
            token: this.generateToken(uuid, String(Date.now())),
        };

        await Mongo.collections.users.insertOne(document);
    }

    public get(query: {}) { return Mongo.collections.users.findOne<User>(query); }

    public getFromUUID(uuid: string) { return Mongo.collections.users.findOne({ minecraftId: uuid }); }

    public async update(uuid: string, update: UserType) {
        if (!(await this.exists(uuid)).valueOf()) return;

        update.token = this.generateToken(uuid, String(Date.now()));

        await Mongo.collections.users.updateOne({ minecraftId: uuid }, {
            $set: update,
        });
    }

    public async exists(uuid: string): Promise<boolean> { return !!(await this.getFromUUID(uuid)); }

    public async existsQuery(query: {}): Promise<boolean> { return !!(await this.get(query)); }
}

export default new Accounts();
