import { ApolloClient, createHttpLink, fromPromise } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import cache from "@/plugins/vue-apollo-cache.js";
import { useAuth } from "@/modules/auth.js";
import { writeCache } from "@/modules/apollo-utils.js";

const { setToken, refreshTokenMutation } = useAuth();

const renewTokenClient = new ApolloClient({
  link: createHttpLink({
    uri: process.env.VUE_APP_GRAPHQL_URL,
    credentials: "include",
  }),
  cache: cache,
});

const getRefreshToken = async () => {
  const {
    data: {
      refreshToken: { token },
    },
  } = await renewTokenClient.mutate({
    mutation: refreshTokenMutation,
  });
  setToken(token);
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      console.log(`[GraphQL Error]: ${err.message}`);
      switch (err.message) {
        case "Invalid refresh token":
        case "Signature has expired":
          return fromPromise(
            getRefreshToken().catch(() => {
              console.log("[RefreshToken Error]");
              setToken("");
              writeCache(cache, "isLoggedIn", false);

              return forward(operation);
            })
          ).flatMap(() => {
            return forward(operation);
          });
      }
    }
  }
});

export default errorLink;
// https://stackoverflow.com/questions/50965347/how-to-execute-an-async-fetch-request-and-then-retry-last-failed-request/51321068#51321068
