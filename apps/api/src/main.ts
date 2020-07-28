import * as express from 'express';
import { migrate, db } from './app/db';
import { createChallenge } from './app/createChallenge';
import { pathChallenge } from './app/patchChallenge';
import { deleteChallenge } from './app/deleteChallenge';
import { json } from 'body-parser';
import * as cors from 'cors';
import { checkAdmin } from './app/check-admin';

const main = async () => {

  await migrate();

  const app = express();
  const router = express.Router();

  router.get('/challenges', async (_, res) => {
    try {
      const { rows } = await db.query('SELECT * FROM challenges ORDER BY title, uuid');
      return res.json(rows);
    } catch (_) {
      return res.sendStatus(500);
    }
  });

  router.post('/challenges', cors(), checkAdmin, async (req, res) => {
    await createChallenge(req, res);
  });

  router.patch('/challenges/:uuid', cors(), checkAdmin, async (req, res) => {
    await pathChallenge(req, res);
  });

  router.delete('/challenges/:uuid', cors(), checkAdmin, async (req, res) => {
    await deleteChallenge(req, res);
  });

  app.use(json({ limit: '5kb' }));
  app.use(cors());
  app.use('/api', router);
  
  
  const port = process.env.PORT || 3333;
  const server = app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/api');
  });
  server.on('error', console.error);
};
 
main().catch(console.error);
