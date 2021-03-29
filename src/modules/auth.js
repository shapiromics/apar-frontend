import { reactive, toRefs } from "@vue/composition-api";
import gql from "graphql-tag";

const state = reactive({
  token: null,
});

export default function useAuth() {
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

  return {
    ...toRefs(state),
    setToken,
    refreshTokenMutation,
    revokeTokenMutation,
    userLoginMutation,
    userCreateMutation,
  };
}
