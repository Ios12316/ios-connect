import Joi from "joi";

const userValidation = Joi.object({
    fullName: Joi.string().trim().required(),
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().min(6).required(),
    school: Joi.string().trim().required(),
    faculty: Joi.string().trim().required(),
    department: Joi.string().trim().required(),
    level: Joi.string().trim().required(),
    gender: Joi.string().trim().required(),
    entryYear: Joi.string().trim().required()
});

const loginValidation = Joi.object({
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().min(6).required()
});

export { userValidation, loginValidation }