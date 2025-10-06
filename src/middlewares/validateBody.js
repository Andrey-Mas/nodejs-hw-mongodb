export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({
        status: 400,
        message: "Validation error",
        data: error.details.map(d => ({ message: d.message, path: d.path })),
      });
    }
    req.body = value;
    next();
  };
};