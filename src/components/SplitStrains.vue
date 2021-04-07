<script>
import { reactive, watch } from "@vue/composition-api";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default {
  name: "SplitStrains",
  setup() {
    const state = reactive({
      openedPanel: null,
    });

    const form = reactive({
      SRRid: "",
      submitSuccessMessage: "",
    })

    // SplitStrains jobCreate mutation
    const submitSplitStrainsJobMutation = gql`
      mutation submitSplitStrainsJob($task: String!, $srrid: String!) {
        splitStrainsJobCreate(input: { task: $task, srrid: $srrid }) {
          job {
            id
          }
        }
      }
    `;

    const { mutate: submitSplitStrainsJob } = useMutation(
      submitSplitStrainsJobMutation
    );
    function mutationSubmitSplitStrainsJob() {
      submitSplitStrainsJob(
        {
          task: "SPLITSTRAINS",
          srrid: form.SRRid,
        },
        {
          update: (cache, { data }) => {
            console.log(data.splitStrainsJobCreate);
            // Updating state and form
            form.submitSuccessMessage = "Job started with " + form.SRRid;
            form.SRRid = "";
            state.openedPanel = null;
          },
        }
      );
    }

    // Function Load Example
    function loadExample() {
      form.SRRid = "SRR6982497";
    }

    // Function Submit NewJob
    function submitNewJob() {
      mutationSubmitSplitStrainsJob();
    }

    // Reacting to panels changes
    watch(
      () => state.openedPanel,
      (newValue) => {
        if (newValue != null) {
          form.submitSuccessMessage = "";
          form.SRRid = "";
        }
      }
    );

    return {
      state,
      form,
      loadExample,
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
          <v-card-title>SplitStrains</v-card-title>
          <v-card-subtitle>
            detects and separates mixed strains of M. tuberculosis.
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
                  <v-flex>
                    Run a SplitStrains job on a SRA dataset :
                    <v-text-field
                      v-model="form.SRRid"
                      class="shrink mx-4 d-inline-flex"
                      style="width: 250px"
                      label="SRR id"
                      hide-details
                      solo
                    >
                    </v-text-field>
                  </v-flex>
                </v-row>
                <v-row>
                  <v-btn class="mx-2 my-2" @click="submitNewJob">
                    Submit
                  </v-btn>
                  <v-btn class="mx-2 my-2" @click="loadExample">
                    Load example
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
