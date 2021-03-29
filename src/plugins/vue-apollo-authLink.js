import { ApolloLink } from "@apollo/client";

import useAuth from "@/modules/auth.js";
const { token } = useAuth();

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: token.value ? `JWT ${token.value}` : undefined,
      },
    };
  });
  return forward(operation);
});

export default authLink;
