import pgPromise from 'pg-promise';
import { InternalServerErrorException } from './utils/exceptions';

// Create a new pgPromise instance
const pgp = pgPromise();

// Configure the connection options
const connectionOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

// Create a new database instance
const db = pgp(connectionOptions);

// Attempt to connect to the database
db.connect()
  .then(() => {
    console.log('Database Connected');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    throw new InternalServerErrorException(error.message)
  });

export default db;