const path = require('path');
require('module-alias')({ base: path.resolve(__dirname, '..', 'api') });
const User = require('~/models/User');
const connect = require('./connect');
const { askQuestion, silentExit } = require('./helpers');

(async () => {
  await connect();

  console.purple('--------------------------');
  console.purple('Reset terms acceptance');
  console.purple('--------------------------');

  console.yellow('This will reset the terms acceptance for all users.');
  const confirm = await askQuestion('Are you sure you want to proceed? (y/n): ');

  if (confirm.toLowerCase() !== 'y') {
    console.yellow('Operation cancelled.');
    silentExit(0);
  }

  try {
    const result = await User.updateMany({}, { $set: { termsAccepted: false } });
    console.green(`Updated ${result.modifiedCount} user(s).`);
  } catch (error) {
    console.red('Error resetting terms acceptance:', error);
    silentExit(1);
  }

  silentExit(0);
})();

process.on('uncaughtException', (err) => {
  if (!err.message.includes('fetch failed')) {
    console.error('There was an uncaught error:');
    console.error(err);
  }

  if (err.message.includes('fetch failed')) {
    return;
  } else {
    process.exit(1);
  }
});
