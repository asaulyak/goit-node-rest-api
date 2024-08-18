import express from 'express';
import validateBody from '../helpers/validateBody.js';
import { userSchema, userSubscriptionSchema, userVerificationSchema } from '../schemas/usersSchema.js';
import {
  getByVerificationToken,
  loginUser,
  logoutUser,
  me,
  registerUser,
  resendVerificationToken,
  updateAvatar,
  updateSubscription
} from '../controllers/authControllers.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { v4 } from 'uuid';

const allowedAvatarTypes = ['image/png', 'image/jpeg'];

const avatarStorage = multer.diskStorage({
  destination: 'temp',
  filename: (req, file, cb) => {
    const extension = file.originalname.split('.').pop() || '';

    cb(null, `${v4()}.${extension}`);
  }
});
const upload = multer({
  storage: avatarStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: function (req, file, callback) {
    if (!allowedAvatarTypes.includes(file.mimetype)) {
      return callback(new Error(`Unsupported filetype ${file.mimetype}`), false);
    }

    callback(null, true);
  }
});

export const authRouter = express.Router();

authRouter.post('/register', validateBody(userSchema), registerUser);
authRouter.post('/login', validateBody(userSchema), loginUser);
authRouter.post('/logout', authMiddleware, logoutUser);
authRouter.get('/current', authMiddleware, me);
authRouter.patch('/subscription', authMiddleware, validateBody(userSubscriptionSchema), updateSubscription);
authRouter.patch('/avatars', authMiddleware, upload.single('avatar'), updateAvatar);
authRouter.get('/verify/:verificationToken', getByVerificationToken);
authRouter.post('/verify', validateBody(userVerificationSchema), resendVerificationToken);
