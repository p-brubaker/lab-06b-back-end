require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    // let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      // const signInData = await fakeRequest(app)
      //   .post('/auth/signup')
      //   .send({
      //     email: 'jon@user.com',
      //     password: '1234'
      //   });
      
      // token = signInData.body.token; // eslint-disable-line
    }, 15000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('/scientists returns scientists', async() => {

      const expectation = [
        {
          id: 1,
          name: 'Ada Lovelace',
          living: false,
          specialty: 'logic'
        },
        {
          id: 2,
          name: 'Alan Turing',
          living: false,
          specialty: 'cryptography'
        },
        {
          id: 3,
          name: 'Donald Knuth',
          living: true,
          specialty: 'open source'
        },
        {
          id: 4,
          name: 'Yukihiro Matsumoto',
          living: true,
          specialty: 'open source'
        },
        {
          id: 5, 
          name: 'Sophie Wilson',
          living: true,
          specialty: 'hardware design'
        },
        {
          id: 6,
          name: 'Haskell Curry',
          living: false,
          specialty: 'logic'
        }
      ];

      const data = await fakeRequest(app)
        .get('/scientists')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('/scientists/:id returns a scientist', async() => {

      const expectation = {
        id: 1,
        name: 'Ada Lovelace',
        living: false,
        specialty: 'logic'
      };

      const data = await fakeRequest(app)
        .get('/scientists/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('POST /scientists add a new scientist', async () => {
      const newScientist = {
        name: 'booger',
        living: true,
        specialties_id: 1
      };

      const data = await fakeRequest(app)
        .post('/scientists').send(newScientist)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.name).toEqual(newScientist.name);
      expect(data.body.id).toBeGreaterThan(0);
    });

    test('UPDATE /scientists/:id updates a scientist', async () => {
      const newScientist = {
        name: 'ada lovelace',
        living: false,
        specialty: 'logic'
      };

      const data = await fakeRequest(app)
        .put('/scientists/1').send(newScientist)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.name).toEqual(newScientist.name);
      expect(data.body.id).toBeGreaterThan(0);
    });


    test('update', () => {

    });

    test('destroooy', () => {

    });
  });
});
