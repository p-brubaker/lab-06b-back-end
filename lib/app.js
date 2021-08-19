const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/', (req, res) => {
  res.send('Hi!');
});

app.get('/specialties', async(req, res) => {
  try {
    const data = await client.query('SELECT * FROM specialties;');
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/scientists', async(req, res) => {
  try {
    const data = await client.query(`SELECT scientists.id,
    scientists.name,
    scientists.living,
    specialties.name AS specialty
      from scientists INNER JOIN specialties
      ON scientists.specialties_id = specialties.id;`);
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/scientists/:id', async(req, res) => {
  try {
    const scientistId = req.params.id;
    const data = await client.query(`SELECT scientists.id,
      scientists.name,
      scientists.living,
      specialties.name AS specialty
        from scientists INNER JOIN specialties 
        ON scientists.specialties_id = specialties.id
        WHERE scientists.id = ${scientistId};`);
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/scientists', async(req, res) => {
  try {
    const data = await client.query(`
      INSERT INTO scientists(
        name,
        specialties_id,
        living
      ) VALUES ($1, $2, $3)
      RETURNING *;`, [
      req.body.name,
      req.body.specialties_id,
      req.body.living]);
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ e: e.message });
  }
});

app.put('/scientists/:id', async(req, res) => {
  try {
    const data = await client.query(`
      UPDATE scientists 
      SET 
        name=$2,
        specialties_id=$3,
        living=$4
      WHERE id = $1
    RETURNING *;`,
    [
      req.params.id,
      req.body.name,
      req.body.specialties_id,
      req.body.living
    ]);
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ e: e.message });
  }
});

app.delete('/scientists/:id', async(req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM scientists
      WHERE id = ${req.params.id}
      RETURNING *;
    `);
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ e: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
