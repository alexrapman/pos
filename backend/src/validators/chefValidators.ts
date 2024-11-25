// backend/src/validators/chefValidators.ts
import Joi from 'joi';

export const validateIngredients = (ingredients: string[]) => {
  const schema = Joi.array()
    .items(Joi.string().trim().min(2).required())
    .min(1)
    .required();

  return schema.validate(ingredients);
};
