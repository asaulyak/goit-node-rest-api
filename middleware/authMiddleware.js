import HttpError from '../helpers/HttpError.js';
import { verifyToken } from '../services/authServices.js';
import { getUserByEmail } from '../services/usersServices.js';

const authError = HttpError(401, 'Not authorized');

export const authMiddleware = async (req, res, next) => {
  const [_, token] = req.headers.authorization?.split(' ') || [];

  if (!token) {
    return next(authError);
  }

  try {
    const payload = verifyToken(token);

    if (!payload?.email) {
      return next(authError);
    }

    const user = await getUserByEmail(payload.email);

    if (user?.token !== token) {
      return next(authError);
    }

    req.user = user;
    next();
  } catch (e) {
    next(authError);
  }
};
