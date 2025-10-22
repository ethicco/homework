#!/usr/bin/env node
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs().option('file', {
  alias: 'f',
  description: 'Путь к файлу логов',
  type: 'string'
}).parse(hideBin(process.argv))

if (!argv.file) {
  console.error('Укажите имя файла логов, например: log.json');
  process.exit(1);
}

if (!fs.existsSync(argv.file)) {
  console.log('Файл не найден');
}

// Функция чтения файла
const readFile = (file) => new Promise((resolve, reject) => {
 const readStream = fs.createReadStream(file, 'utf-8')
    let data = '';

    readStream.on('data', (chunk) => {
      data += chunk;
    })
    readStream.on('error', (error) => {
      reject(error)
    })
    readStream.on('end', () => {
      resolve(data)
      readStream.close()
    })
})

const start = async () => {
  const data = await readFile(argv.file);
  const logs = JSON.parse(data);

  const partyGame = logs.length;
  const winParty = logs.filter(el => el.choice === el.secret).length;
  const loseParty = partyGame - winParty;
  const percentWinParty = ((partyGame - loseParty) * 100) / partyGame

  console.log('Общее количество партий: ', partyGame);
  console.log('Количество выигранных: ', winParty);
  console.log('Количество проигранных партий: ', loseParty);
  console.log('Процентное соотношение выигранных партий ', percentWinParty + '%')
}

start()
