import express from 'express';
import validateBody from '../helpers/validateBody.js';
import { userSchema, userSubscriptionSchema } from '../schemas/usersSchema.js';
import {
  loginUser,
  logoutUser,
  me,
  registerUser,
  updateAvatar,
  updateSubscription
} from '../controllers/authControllers.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { v4 } from 'uuid';

const avatarStorage = multer.diskStorage({
  destination: 'temp',
  filename: (req, file, cb) => {
    const extension = file.originalname.split('.').pop() || '';

    cb(null, `${v4()}.${extension}`);
  }
});
const upload = multer({ storage: avatarStorage });

export const authRouter = express.Router();

authRouter.post('/register', validateBody(userSchema), registerUser);
authRouter.post('/login', validateBody(userSchema), loginUser);
authRouter.post('/logout', authMiddleware, logoutUser);
authRouter.get('/current', authMiddleware, me);
authRouter.patch('/subscription', authMiddleware, validateBody(userSubscriptionSchema), updateSubscription);
authRouter.patch('/avatars', authMiddleware, upload.single('avatar'), updateAvatar);
