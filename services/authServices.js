import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();

const secret = process.env.JWT_SECRET;

export const sighToken = payload =>
  jwt.sign({ iat: Math.floor(Date.now() / 1000), ...payload }, secret, { expiresIn: '1h' });

export const verifyToken = token => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
