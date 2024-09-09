import dotenv from 'dotenv';

dotenv.config();

export const config = {
  jwtSecret: process.env.JWT_SECRET,
  usersFilePath: process.env.USERS_FILE_PATH,
  dataFilePath: process.env.DATA_FILE_PATH,
  serverPort: 3000,
  serverHost: '127.0.0.1'
};