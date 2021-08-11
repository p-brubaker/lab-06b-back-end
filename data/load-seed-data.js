const client = require('../lib/client');
// import our seed data:
const scientists = require('./scientists.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      scientists.map(scientist => {
        return client.query(`
                    INSERT INTO scientists (name, specialty, living)
                    VALUES ($1, $2, $3);
                `,
        [scientist.name, scientist.specialty, scientist.living]);
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
