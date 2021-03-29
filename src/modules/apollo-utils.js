import gql from "graphql-tag";

export const writeCache = (cache, key, value) => {
  return cache.writeQuery({
    query: gql`
      query {
        ${key}
      }
    `,
    data: {
      [key]: value,
    },
  });
};
