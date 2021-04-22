<script>
import { reactive, watch } from "@vue/composition-api";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default {
  name: "JobBacGWASim",
  setup() {
    const state = reactive({
      openedPanel: null,
    });

    const form = reactive({
      submitSuccessMessage: "",
    })

    // BacGWASim jobCreate mutation
    const submitBacGWASimJobMutation = gql`
      mutation submitBacGWASimJob($task: String!) {
        bacgwasimJobCreate(input: { task: $task }) {
          job {
            id
          }
        }
      }
    `;

    const { mutate: submitBacGWASimJob } = useMutation(
      submitBacGWASimJobMutation
    );
    function mutationSubmitBacGWASimJob() {
      submitBacGWASimJob(
        {
          task: "BACGWASIM",
        },
        {
          update: (cache, { data }) => {
            console.log(data.bacgwasimJobCreate);
            // Updating state and form
            form.submitSuccessMessage = "Job started.";
            state.openedPanel = null;
          },
        }
      );
    }

    // Function Submit NewJob
    function submitNewJob() {
      mutationSubmitBacGWASimJob();
    }

    // Reacting to panels changes
    watch(
      () => state.openedPanel,
      (newValue) => {
        if (newValue != null) {
          form.submitSuccessMessage = "";
        }
      }
    );

    return {
      state,
      form,
      submitNewJob,
    };
  },
};
</script>

<template>
  <v-container class="my-4">
    <v-row>
      <v-col lg="6" offset-lg="3" md="8" offset-md="2">
        <v-card class="pa-4 my-4">
          <v-card-title>BacGWASim</v-card-title>
          <v-card-subtitle>
            simulates.
          </v-card-subtitle>

          <v-expansion-panels inset v-model="state.openedPanel">
            <v-expansion-panel align="left">
              <v-expansion-panel-header class="text-button">
                Run a new job
                <span
                  v-if="form.submitSuccessMessage"
                  class="text text-center green--text font-weight-bold"
                >
                  {{ form.submitSuccessMessage }}
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-btn class="pa-4 mx-2" @click="submitNewJob">
                    Submit
                  </v-btn>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header class="text-button">
                Consult results
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>
