const client = require('../lib/client');
// import our seed data:
const scientists = require('./scientists.js');
const { getEmoji } = require('../lib/emoji.js');
const specialties = require('./specialties.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      scientists.map(scientist => {
        return client.query(
          `INSERT INTO scientists (name, specialties_id, living, img_url)
                    VALUES ($1, $2, $3, $4);
                `,
          [scientist.name, scientist.specialties_id, scientist.living, scientist.img_url]);
      })
    );
    await Promise.all(
      specialties.map(specialty => {
        return client.query(
          `INSERT INTO specialties (name)
                    VALUES ($1);
          `,
          [specialty.name]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
