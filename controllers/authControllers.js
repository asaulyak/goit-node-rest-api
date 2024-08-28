import {
  comparePassword,
  createUser,
  getUserByEmail,
  getUserByVerificationToken,
  updateUserById
} from '../services/usersServices.js';
import HttpError from '../helpers/HttpError.js';
import { sighToken } from '../services/authServices.js';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { sendEmail } from '../email/email.service.js';
import { v4 } from 'uuid';
import {sendVerificationEmail} from '../helpers/sendVerificationEmail.js'

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return next(HttpError(409, 'Email in use'));
    }

    const user = await createUser({ email, password });

    await sendVerificationEmail(user);

    res.status(201).json({
      user: {
        email,
        subscription: user.subscription
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

    if (!user.verify) {
      return next(HttpError(403, 'Email is not verified'));
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

export const updateAvatar = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(HttpError(500));
  }

  try {
    const avatar = req.file;

    const avatarURL = path.join('/avatars', avatar.filename);

    await fs.promises.rename(avatar.path, path.join('public', 'avatars', avatar.filename));

    await updateUserById(user.id, {
      avatarURL
    });

    res.json({
      avatarURL
    });
  } catch (e) {
    next(HttpError(500));
  }
};

export const getByVerificationToken = async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await getUserByVerificationToken(verificationToken);

  if (!user) {
    return next(HttpError(404, 'User not found'));
  }

  await updateUserById(user.id, {
    verificationToken: null,
    verify: true
  });

  res.json({
    message: 'Verification successful'
  });
};

export const resendVerificationToken = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return next(HttpError(404, 'User not found'));
    }

    if (user.verify) {
      return next(HttpError(400, 'Verification has already been passed'));
    }

    const updatedUser = {
      verify: false,
      verificationToken: v4()
    };

    await updateUserById(user.id, updatedUser);

    await sendVerificationEmail({
      email: user.email,
      ...updatedUser
    });

    res.json({
      message: 'Verification email sent'
    });
  } catch (e) {
    next(HttpError(500));
  }
};
