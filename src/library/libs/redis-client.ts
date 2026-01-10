import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.error('Ошибка Redis:', err));

(async () => {
  await client.connect();
  console.log('✅ Redis подключен');
})();

export default client;
