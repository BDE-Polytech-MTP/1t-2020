import { db } from './db';
import { Request, Response, NextFunction } from 'express';

export async function checkAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.headers["www-authenticate"]) {

        try {
            const { rows } = await db.query('SELECT * FROM admins WHERE token=$1', [req.headers["www-authenticate"]]);
            if (rows.length === 1) {
                console.log(`${req.method} request on ${req.url} by ${rows[0].name}.`);
                console.log('Payload:');
                console.log(JSON.stringify(req.body));
                console.log();
                next();
            } else {
                return res.status(401);
            }
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }

    } else {
        res.sendStatus(401);
    }
}