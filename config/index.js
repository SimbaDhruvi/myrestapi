import dotenv from 'dotenv';

dotenv.config();

export const {
    APP_PORT,
    DEBUG_MODE,
    DB_URL,
    JWT_SECRETKEY,
    REFRESH_SECRETKEY,
    APP_URL
} = process.env;