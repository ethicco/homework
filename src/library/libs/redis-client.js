// redisClient.js
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.error('Ошибка Redis:', err));

(async () => {
  await client.connect();
  console.log('✅ Redis подключен');
})();

module.exports = client;