import { reactive, toRefs } from "@vue/composition-api";
import gql from "graphql-tag";

import apolloClient from "@/plugins/vue-apollo-client.js";
import { writeCache } from "@/modules/apollo-utils.js";

export default function useAuth() {

  const state = reactive({
    token: null,
  });

  function setToken(token) {
    state.token = token;
  }

  const refreshTokenMutation = gql`
    mutation refreshToken {
      refreshToken(input: {}) {
        token
      }
    }
  `;

  const refreshTokenUpdate = async(cache, {data}) => {
    setToken(data.refreshToken.token);
    await writeCache(cache, "isLoggedIn", true);
  }

  const refreshToken = async() => {
    await apolloClient.mutate({
      mutation: refreshTokenMutation,
      update: refreshTokenUpdate,
    })
  }

  const revokeTokenMutation = gql`
    mutation revokeToken {
      revokeToken(input: {}) {
        revoked
      }
    }
  `;

  const userCreateMutation = gql`
    mutation userCreate(
      $username: String!
      $password: String!
      $email: String!
    ) {
      userCreate(
        input: { username: $username, password: $password, email: $email }
      ) {
        success
        errors
        user {
          id
          username
        }
      }
    }
  `;

  const userLoginMutation = gql`
    mutation UserLogin($username: String!, $password: String!) {
      tokenAuth(input: { username: $username, password: $password }) {
        token
      }
    }
  `;

  const isLoggedInQuery = gql`
    query {
      isLoggedIn @client
    }
  `;

  const isLoggedIn = async () => {
    const {
      data: { isLoggedIn },
    } = await apolloClient.query({
      query: isLoggedInQuery,
    });

    return isLoggedIn;
  };

  return {
    ...toRefs(state),
    setToken,
    isLoggedInQuery,
    isLoggedIn,
    refreshTokenMutation,
    refreshToken,
    revokeTokenMutation,
    userLoginMutation,
    userCreateMutation,
  };
}
