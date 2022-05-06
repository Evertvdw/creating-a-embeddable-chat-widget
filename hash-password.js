const yargs = require('yargs');
const bcrypt = require('bcrypt');

const options = yargs
  .usage('Usage: -p <password>')
  .option('p', {
    alias: 'password',
    describe: 'Password to hash',
    type: 'string',
    demandOption: true,
  }).argv;

bcrypt.hash(options.p, 10, function (err, hash) {
  console.log(hash);
});
