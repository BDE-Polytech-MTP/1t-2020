import { Request, Response } from 'express';
import { db } from './db';
import { Challenge } from '@1t/api-interfaces';
import { v4 as uuid } from 'uuid';

export async function createChallenge(req: Request, res: Response) {
    
    if (!isBodyValid(req)) {
        return res.sendStatus(400);
    }

    const challenge: Challenge = {
        uuid: uuid(),
        title: req.body.title,
        score: req.body.score,
        sam: 0,
        clover: 0,
        alex: 0,
        category: req.body.category
    };

    try {
        await insertChallenge(challenge);
        return res.status(201).json(challenge);
    } catch (_) {
        return res.sendStatus(500);
    }

}

function isBodyValid(req: Request): boolean {
    return req.body && 
          typeof req.body.title === 'string' && req.body.title.length > 0 && req.body.title.length <= 255 &&
          typeof req.body.score === 'number' && req.body.score >= 0 &&
          (req.body.category === null || typeof req.body.category === 'string' && req.body.category.length > 0 && req.body.category.length <= 255);
}

async function insertChallenge(challenge: Challenge) {
    await db.query(
        'INSERT INTO challenges (uuid, title, score, sam, clover, alex, category) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
        [challenge.uuid, challenge.title, challenge.score, challenge.sam, challenge.clover, challenge.alex, challenge.category]
    );
}
