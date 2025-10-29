#!/usr/bin/env node -r dotenv/config

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const https = require('https');
const { apiKey } = require('./config')

const argv = yargs().option('city', {
  alias: 'c',
  type: 'string',
  description: 'Город'
}).parse(hideBin(process.argv))

if(!argv.city){
  console.error('Введите название города')
  return
} else {
  const getRequest = async (url) => {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        res.setEncoding('utf8')

        let rowData = ''
        
        res.on('data', (chunk) => rowData += chunk)
      
        res.on('end', () => {
          resolve(JSON.parse(rowData))
        })
      })
      .on('error', (error) => {
          reject(error)
      })
    })
  } 


  const getLocation = async (city) => {
    return getRequest(`https://www.meteoblue.com/ru/server/search/query3?query=${city}&apikey=${apiKey}.`)
  }

  const getWeather = async (city) => {
    const { results } = await getLocation(city);

    const data = results[0];

    console.log('Прогноз погоды в городе: ', data.name)

    return getRequest(`https://my.meteoblue.com/packages/basic-day?apikey=${apiKey}&lat=${data.lat}1&lon=${data.lon}&asl=${data.asl}&format=json&windspeed=ms-1`)
  }

  const start = async () => {
    const res = await getWeather(argv.city)
    
    console.log(res)
  }

  start()
}



