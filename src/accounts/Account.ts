import User from '../models/UserModel';
import Mongo from '../utils/Mongo';

class Accounts {
    public async create(name: string, uuid: string) {
        const document: User = {
            name,
            created: String(Math.floor(Date.now() / 1000)),
            minecraftId: uuid,
        };

        await Mongo.collections.users.insertOne(document);
    }

    public get(uuid: string) { return Mongo.collections.users.findOne({ minecraftId: uuid }); }

    public async exists(uuid: string): Promise<boolean> { return !!(await this.get(uuid)); }
}

export default new Accounts();
