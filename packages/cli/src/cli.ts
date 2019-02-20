const packageJson = require('../package.json');

export default async function run() {
  require('yargs')
    .usage('codepipe [command] [flags]')
    .commandDir('cmds')
    .demandCommand()
    .help()
    .argv
}

run();