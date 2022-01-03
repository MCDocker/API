import { Request, Response } from 'express';

export type RouteOptions = {
    method: 'get' | 'post' | 'delete' | 'put' | 'all',
    url: string,
}

export default abstract class Route {
    abstract opts: RouteOptions;

    get options() { return this.opts; }

    abstract init(req: Request, res: Response)
}
