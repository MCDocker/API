import { ObjectId } from 'mongodb';

export interface UserType {
    name?: string,
    created?: string,
    minecraftId?: string,
    token?: string
}

export default class User {
    constructor(
        public name: string,
        public created: string,
        public minecraftId: string,
        public token: string,
        public objectId?: ObjectId,
    ) {}
}
