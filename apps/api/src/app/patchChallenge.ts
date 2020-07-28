import { Request, Response } from 'express';
import { db } from './db';
import { Pool, PoolClient } from 'pg';
import { Challenge } from '@1t/api-interfaces';

export async function pathChallenge(req: Request, res: Response) {

    if (!isBodyValid(req)) {
        return res.sendStatus(400);
    }

    try {
        const challenge: Challenge | null = await updateTeams(req);
        if (challenge) {
            return res.json(challenge);
        }
        return res.sendStatus(404);
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

function isBodyValid(req: Request): boolean {
    return req.body && (hasTeam(req, 'sam') || hasTeam(req, 'alex') || hasTeam(req, 'clover'));
}

function hasTeam(req: Request, team: string): boolean {
    return team in req.body && typeof req.body[team] === 'boolean';
}

async function updateTeams(req: Request): Promise<Challenge | null> {
    return await transaction(db, async (client) => {
        let found = false;
        let row: Challenge | null = null;
        
        if (hasTeam(req, 'sam')) {
             const { rowCount } = await client.query('UPDATE challenges SET sam=$2 WHERE uuid=$1', [req.params.uuid, req.body.sam]);
             if (rowCount === 1) {
                 found = true;
             }
        }

        if (hasTeam(req, 'clover')) {
            const { rowCount } = await client.query('UPDATE challenges SET clover=$2 WHERE uuid=$1', [req.params.uuid, req.body.clover]);
            if (rowCount === 1) {
                found = true;
            }
        }

        if (hasTeam(req, 'alex')) {
            const { rowCount } = await client.query('UPDATE challenges SET alex=$2 WHERE uuid=$1', [req.params.uuid, req.body.alex]);
            if (rowCount === 1) {
                found = true;
            }
        }

        if (found) {
            const { rows } = await client.query('SELECT * from challenges WHERE uuid=$1', [req.params.uuid]);           
            if (rows.length === 1) {
                row = rows[0];
            }
        }

        return row;
    });

}

async function transaction(db: Pool, executor: (client: PoolClient) => Promise<Challenge | null>): Promise<Challenge | null> {
    const client = await db.connect();
    let result: Challenge | null;

    try {
        await client.query('BEGIN');
        result = await executor(client);
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }

    return result;
}
