#!/usr/bin/env node
const { add, sub } = require('date-fns')
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const currentDate = new Date() 

yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .command('current', 'Текущая дата и время в формате ISO',  yargs => yargs
    .option('year', {
      alias: 'y',
      type: 'boolean',
      description: 'Текущий год',
      default: false,
    })
    .option('month', {
      alias: 'm',
      type: 'boolean',
      description: 'Текущий месяц',
      default: false,
    })
    .option('date', {
      alias: 'd',
      type: 'boolean',
      description: 'Дата в календарном месяце',
      default: false,
    }),
    argv => {
      if(argv.year){
        return console.log(currentDate.getFullYear());
      }

      if(argv.month) {
        return console.log(currentDate.getMonth() + 1);
      }

      if(argv.date) {
        return console.log(currentDate.getDate());
      }

      return console.log('Текущая дата: ', currentDate.toISOString())
    }
  )
  .command('add', 'Получает даты в будущем', yargs => yargs
    .option('year', {
      alias: 'y',
      type: 'number',
      description: 'Добавить лет',
    })
    .option('month', {
      alias: 'm',
      type: 'number',
      description: 'Добавить месяцев',
    })
    .option('date', {
      alias: 'd',
      type: 'number',
      description: 'Добавить дней',
    }),
    argv => {
      console.log(
        add(currentDate, {
          years: argv.year || 0,
          months: argv.month || 0,
          days: argv.date || 0
        }).toISOString()
      )
    }
  )
  .command('sub', 'Получает даты в прошлом', yargs => yargs
    .option('year', {
      alias: 'y',
      type: 'number',
      description: 'Вычесть лет',
    })
    .option('month', {
      alias: 'm',
      type: 'number',
      description: 'Вычесть месяцев',
    })
    .option('date', {
      alias: 'd',
      type: 'number',
      description: 'Вычесть дней',
    }),
    argv => {
      console.log(
        sub(currentDate, {
          years: argv.year || 0,
          months: argv.month || 0,
          days: argv.date || 0
        }).toISOString()
      )
    }
  )
  .parse()