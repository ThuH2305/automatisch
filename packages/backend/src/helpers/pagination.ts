import { QueryBuilder, Model } from 'objection';

const paginate = async (
  query: QueryBuilder<Model, Model[]>,
  limit: number,
  offset: number
) => {
  if (limit < 1 || limit > 100) {
    throw new Error('Limit must be between 1 and 100');
  }

  const [records, count] = await Promise.all([
    query.limit(limit).offset(offset),
    query.resultSize(),
  ]);

  return {
    pageInfo: {
      currentPage: Math.ceil(offset / limit + 1),
      totalPages: Math.ceil(count / limit),
    },
    edges: records.map((record: Model) => {
      return {
        node: record,
      };
    }),
  };
};

export default paginate;
