import { Request, Response } from 'express';

export type RouteOptions = {
    name: string,
    method: 'get' | 'post' | 'delete' | 'put' | 'all',
    url: string,
    oneTime?: boolean,
}

export default abstract class Route {
    constructor(private opts: RouteOptions) {}

    get options() { return this.opts; }

    abstract init(req: Request, res: Response)
}
