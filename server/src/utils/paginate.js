export const paginate = async ({
  model,
  query = {},
  page = 1,
  limit = 10,
  sort = "-createdAt",
  select = "",
  populate = [],
  lean = true,
}) => {
  const skip = (page - 1) * limit;

  const total = await model.countDocuments(query);

  let mongoQuery = model
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(select);

  if (populate.length) {
    populate.forEach((p) => {
      mongoQuery = mongoQuery.populate(p);
    });
  }

  if (lean) {
    mongoQuery = mongoQuery.lean();
  }

  const data = await mongoQuery;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};
