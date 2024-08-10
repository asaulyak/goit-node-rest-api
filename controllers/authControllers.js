import { comparePassword, createUser, getUserByEmail, updateUserById } from '../services/usersServices.js';
import HttpError from '../helpers/HttpError.js';
import { sighToken } from '../services/authServices.js';

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return next(HttpError(409, 'Email in use'));
    }

    const { subscription } = await createUser({ email, password });

    res.status(201).json({
      user: {
        email,
        subscription
      }
    });
  } catch (e) {
    next(e);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await comparePassword(email, password);

    if (!user) {
      return next(HttpError(401, 'Email or password is wrong'));
    }

    const userData = {
      subscription: user.subscription,
      email: user.email,
      id: user.id
    };

    const token = sighToken(userData);

    await updateUserById(user.id, {
      token
    });

    return res.status(200).json({
      token,
      user: userData
    });
  } catch (e) {
    next(HttpError(401, 'Email or password is wrong'));
  }
};

export const logoutUser = async (req, res, next) => {
  if (!req.user) {
    return next(HttpError(500));
  }

  try {
    await updateUserById(req.user.id, { token: null });

    res.sendStatus(204);
  } catch (error) {
    return next(HttpError(500));
  }
};

export const me = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(HttpError(500));
  }

  const { email, subscription } = user;

  res.json({ email, subscription });
};

export const updateSubscription = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(HttpError(500));
  }

  const { subscription } = req.body;

  if (!subscription) {
    return next(HttpError(500));
  }

  try {
    await updateUserById(user.id, {
      subscription
    });

    res.sendStatus(204);
  } catch (e) {
    next(HttpError(500));
  }
};
