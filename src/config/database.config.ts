import { DatabaseInterface } from 'src/database/database.interface';

export default (): { database: DatabaseInterface } => ({
  database: {
    type: (process.env.DB_TYPE as 'postgres') || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'form',
  },
});
