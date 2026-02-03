export const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (err) {
    if (err.issues) {
      console.log("Zod Validation Error:", JSON.stringify(err.issues, null, 2));
    }
    next(err);
  }
};
