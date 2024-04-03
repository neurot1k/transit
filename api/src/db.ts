import postgres from 'postgres';

export const db = postgres({
  host: 'localhost',
  port: 5432,
  database: 'zeroaught',
  username: 'postgres',
  password: 'i8LzauqSqgbB43v3',
});
