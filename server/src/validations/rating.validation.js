export const ratingSchema = {
  body: {
    rating: {
      type: "number",
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: "string",
      optional: true,
      maxLength: 500,
    },
  },
};
