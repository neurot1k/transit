import { createClient } from 'redis';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


export const db = await open({
  //filename: '../../../data/transit.db',
  filename: 'C:\\zeroaught.io\\transit\\data\\transit.db',
  driver: sqlite3.Database,
});

export const redis = createClient({
  socket: {
    host: '127.0.0.1', // 'localhost' does not work with default docker instance
    port: 6379,
  }
})

redis.on('error', (err) => console.log('Redis Client Error', err));

await redis.connect();