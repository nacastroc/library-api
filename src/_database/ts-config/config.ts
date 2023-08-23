export const config = {
  development: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'library_api_development',
    username: 'postgres',
    password: 'postgres',
  },
  test: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'library_api_test',
    username: 'postgres',
    password: 'postgres',
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};