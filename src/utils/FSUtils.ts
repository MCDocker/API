import fs from 'fs';
import p from 'path';

export const readAllSubFiles = (path: string) => {
    let list = [];
    const files = fs.readdirSync(path);
    let stats;
    files.forEach((file) => {
        stats = fs.lstatSync(p.join(path, file));
        if (stats.isDirectory()) {
            list = list.concat(readAllSubFiles(p.join(path, file)));
        } else {
            list.push(p.join(path, file));
        }
    });

    return list;
};
