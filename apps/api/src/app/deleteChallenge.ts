import { Request, Response } from 'express';
import { db } from './db';

export async function deleteChallenge(req: Request, res: Response) {

    try {
        const { rowCount } = await db.query('DELETE FROM challenges WHERE uuid=$1', [req.params.uuid]);
        if (rowCount === 1) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }

}