import path from 'path';
import { Request, Response } from 'express';
import Route from './Route';
import { app } from '.';
import { readAllSubFiles } from './utils/FSUtils';

const files = readAllSubFiles(path.join(__dirname, 'routes'));
const registeredRoutes: Route[] = [];

class RouteHandler {
    registerRoutes() {
        return new Promise(async (resolve, reject) => {
            await files.forEach(async (file) => {
                if (file.endsWith('.js') || file.endsWith('.ts')) {
                    const route: Route = (await import(file)).default;
                    registeredRoutes.push(route);
                }
            });
            resolve('');
        });
    }

    handleRoutes() {
        return new Promise((resolve, reject) => {
            registeredRoutes.forEach((route) => {
                switch (route.options.method) {
                    case 'get':
                        app.get(`/api/${route.options.url}`, (req: Request, res: Response) => {
                            route.init(req, res);
                        });
                        break;
                    case 'post':
                        app.post(`/api/${route.options.url}`, (req: Request, res: Response) => {
                            route.init(req, res);
                        });
                        break;
                    case 'all':
                        app.all(`/api/${route.options.url}`, (req: Request, res: Response) => {
                            route.init(req, res);
                        });
                        break;
                    case 'delete':
                        app.delete(`/api/${route.options.url}`, (req: Request, res: Response) => {
                            route.init(req, res);
                        });
                        break;
                    case 'put':
                        app.put(`/api/${route.options.url}`, (req: Request, res: Response) => {
                            route.init(req, res);
                        });
                        break;
                    default:
                        break;
                }
            });
            resolve('');
        });
    }
}

export default new RouteHandler();
