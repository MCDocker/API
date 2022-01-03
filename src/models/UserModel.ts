import { ObjectId } from 'mongodb';

export default class User {
    constructor(
        public name: string,
        public created: string,
        public minecraftId: string,
        public objectId?: ObjectId,
    ) {}
}
