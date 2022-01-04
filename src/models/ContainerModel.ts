import { ObjectId } from 'mongodb';
import ModsModel from './ModsModel';
import User from './UserModel';

interface ClientModel {
    dataUrl: string,
    name: string,
    javaVersion: number,
    mainClass: string,
    startupArguments: string,
    type: string,
}

export default class ContainerModel {
    constructor(
        public name: string,
        public id: string,
        public memory: string,
        public mods: ModsModel[],
        public client: ClientModel,
        public objectID: ObjectId,
        public minecraftId: string,
    ) {}
}
