#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')

const argv = yargs().option('file', {
  alias: 'f', 
  description: 'Введите имя файла',
  type: 'string'
}).parse(hideBin(process.argv))

const logFile = argv.file;

if (!logFile) {
  console.error('Укажите имя файла для логирования, например: log.json');
  process.exit(1);
}

// Создаём интерфейс для ввода
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Функция чтения файла
const readFile = (file) => new Promise((resolve) => {
 const readStream = fs.createReadStream(file, 'utf-8')
    let data = '';

    readStream.on('data', (chunk) => {
      data += chunk;
    })
    readStream.on('end', () => {
      resolve(data)
      readStream.close()
    })
})


// Функция для записи результата в лог
async function writeLog(result) {
  let logs = [];

  if(fs.existsSync(logFile)){
    const data = await readFile(logFile);
    logs.push(...JSON.parse(data));
  }

  logs.push(result)

  const writeStream = fs.createWriteStream(logFile, 'utf-8')
  writeStream.write(JSON.stringify(logs, null, 2))
  writeStream.close()
}

// Основная логика игры
function playGame() {
  const secret = Math.floor(Math.random() * 2) + 1; // 1 или 2

  rl.question('Орёл (1) или решка (2)? ', (answer) => {
    const guess = parseInt(answer, 10);

    if (guess === secret) {
      console.log('Вы угадали!');
      writeLog({ result: 'win', choice: guess, secret, time: new Date().toISOString() });
    } else {
      console.log('Не угадали!');
      writeLog({ result: 'lose', choice: guess, secret, time: new Date().toISOString() });
    }
    rl.close();
  });
}

playGame();