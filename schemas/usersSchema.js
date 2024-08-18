import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const userSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required()
});

export const userVerificationSchema = Joi.object({
  email: Joi.string().email().required()
});
