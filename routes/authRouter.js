import express from 'express';
import validateBody from '../helpers/validateBody.js';
import { userSchema, userSubscriptionSchema } from '../schemas/usersSchema.js';
import { loginUser, logoutUser, me, registerUser, updateSubscription } from '../controllers/authControllers.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const authRouter = express.Router();

authRouter.post('/register', validateBody(userSchema), registerUser);
authRouter.post('/login', validateBody(userSchema), loginUser);
authRouter.post('/logout', authMiddleware, logoutUser);
authRouter.get('/current', authMiddleware, me);
authRouter.patch('/subscription', authMiddleware, validateBody(userSubscriptionSchema), updateSubscription);
