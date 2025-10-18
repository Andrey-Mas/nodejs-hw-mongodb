import Joi from "joi";

const stringRule = Joi.string().min(3).max(20).trim();

export const createContactSchema = Joi.object({
  name: stringRule.required(),
  phoneNumber: stringRule.required(),
  email: stringRule.email().min(3).max(254).trim().optional(),
  isFavourite: Joi.boolean().optional(),
  photo: Joi.string().uri().optional(),
  contactType: Joi.string().valid("work", "home", "personal").required(),
});

export const updateContactSchema = Joi.object({
  name: stringRule.optional(),
  phoneNumber: stringRule.optional(),
  email: Joi.alternatives().try(Joi.string().email().min(3).max(254).trim(), Joi.allow(null)).optional(),
  isFavourite: Joi.boolean().optional(),
  photo: Joi.string().uri().optional(),
  contactType: Joi.string().valid("work", "home", "personal").optional(),
}).min(1);