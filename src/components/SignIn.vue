<script>
import { reactive, ref } from "@vue/composition-api";
import { useMutation } from "@vue/apollo-composable";

import useAuth from "@/modules/auth.js";
import { writeCache } from "@/modules/apollo-utils.js";

export default {
  setup(props, context) {
    const state = reactive({
      errMessage: "",
      passwordVisible: false,
      repasswordVisible: false,
      signingIn: true,
      submitLabel: "Login",
      usernameErr: false,
      passwordErr: false,
      repasswordErr: false,
    });

    // Form validation
    const formRef = ref(null);
    const form = reactive({
      username: "",
      usernameRules: [(v) => !!v || "Username is required"],
      password: "",
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 8) || "Password must be at least 8 characters",
      ],
      repassword: "",
      errMessage: "",
      successMessage: "",
    });

    // Get useAuth functions
    const { setToken, userLoginMutation, userCreateMutation } = useAuth();

    // Switch between registering and sign in modes
    function switchMode() {
      state.signingIn = !state.signingIn;
      state.submitLabel = state.signingIn ? "Login" : "Register";
      state.errMessage = null;
    }

    // userLogin mutation
    const { mutate: userLogin } = useMutation(userLoginMutation);
    function mutateUserLogin() {
      userLogin(
        {
          username: form.username,
          password: form.password,
        },
        {
          update: (cache, { data }) => {
            if (data.tokenAuth.token) {
              setToken(data.tokenAuth.token);
              writeCache(cache, "isLoggedIn", true);
              context.root.$router.push("/");
            } else {
              // Handling errors
              if ("nonFieldErrors" in data.tokenAuth.errors) {
                state.errMessage =
                  data.tokenAuth.errors.nonFieldErrors[0].message;
              }
            }
          },
        }
      ).catch(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          console.log("GQL Error ", graphQLErrors);
          form.errMessage = graphQLErrors[0].message;
        }
        if (networkError) {
          console.log("Network Error ", networkError);
        }
      });
    }

    // userRegister mutation
    const { mutate: userRegister } = useMutation(userCreateMutation);
    function mutateUserRegister() {
      userRegister(
        {
          username: form.username,
          password: form.password,
          email: form.username,
        },
        {
          update: (cache, { data }) => {
            if (data.userCreate.success) {
              switchMode();
              form.successMessage = "User created";
            } else {
              console.log(data.userCreate.errors);
              // Handling errors
              if ("nonFieldErrors" in data.userCreate.errors) {
                state.errMessage =
                  data.tokenAuth.errors.nonFieldErrors[0].message;
              }
            }
          },
        }
      ).catch(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          console.log("GQL Error ", graphQLErrors);
          form.errMessage = graphQLErrors[0].message;
        }
        if (networkError) {
          console.log("Network Error ", networkError);
        }
      });
    }

    // Submit the form
    function submit() {
      console.log('clicking?')
      if (formRef.value.validate()) {
        console.log('In here')
        if (state.signingIn) {
          mutateUserLogin();
        } else {
          mutateUserRegister();
        }
      }
    }

    return {
      state,
      form,
      formRef,
      submit,
      switchMode,
      userLogin,
    };
  },
};
</script>

<template>
  <v-container class="my-6">
    <v-row>
      <v-col lg="4" offset-lg="4" md="8" offset-md="2">
        <v-card>
          <v-form ref="formRef" class="px-12 py-5">
            <h1 v-if="state.signingIn" class="v-heading text-h4 text-center">
              Sign In
            </h1>
            <h1 v-else class="v-heading text-h4 text-center">Registering</h1>
            <v-text-field
              v-model="form.username"
              :rules="form.usernameRules"
              label="Username"
              required
              @keydown.enter="submit"
            >
            </v-text-field>

            <v-text-field
              v-model="form.password"
              :rules="form.passwordRules"
              label="Password"
              required
              :append-icon="state.passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="state.passwordVisible ? 'text' : 'password'"
              @click:append="state.passwordVisible = !state.passwordVisible"
              @keydown.enter="submit"
            >
            </v-text-field>

            <v-text-field
              v-if="!state.signingIn"
              v-model="form.repassword"
              :rules="[
                form.password == form.repassword || 'Password must match',
              ]"
              label="Confirm Password"
              :append-icon="state.repasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="state.repasswordVisible ? 'text' : 'password'"
              @click:append="state.repasswordVisible = !state.repasswordVisible"
              @keydown.enter="submit"
            >
            </v-text-field>
            <p
              v-if="form.errMessage"
              class="text text-center red--text font-weight-bold"
            >
              {{ form.errMessage }}
            </p>
            <p
              v-if="form.successMessage"
              class="text text-center green--text font-weight-bold"
            >
              {{ form.successMessage }}
            </p>
            <v-btn class="my-4" block @click="submit">
              {{ state.submitLabel }}
            </v-btn>
            <div v-if="state.signingIn" class="text text-center mt-5">
              Not a member?
              <v-btn class="mx-4" small rounded @click="switchMode">
                Register
              </v-btn>
            </div>
            <div v-else class="text text-center mt-5">
              Already an account?
              <v-btn class="mx-4" small rounded @click="switchMode">
                Sign in
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>