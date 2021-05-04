<script>
import httpClient from "@/plugins/axios.js";
import { reactive, watch } from "@vue/composition-api";
import { useMutation, useResult, useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default {
  name: "JobBacGWASim",
  setup() {
    const state = reactive({
      openedPanel: null,
    });

    const form = reactive({
      submitSuccessMessage: "",
    });

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

    // userJobHistory query
    const { loading, result } = useQuery(
      gql`
        query($status: String!) {
          bacgwasimJobs(status: $status) {
            edges {
              node {
                id
                task
                status
                created
                label
                results {
                  id
                }
                user {
                  username
                }
              }
            }
          }
        }
      `,
      {
        status: "completed",
      }
    );
    state.userJobs = useResult(result, [], (data) => data.bacgwasimJobs.edges);

    // Results table
    const headers = [
      { text: "Label", value: "label" },
      { text: "Download", value: "download", align: "center", sortable: false },
      { text: "Created", value: "createdOn" },
      { text: "jobID", value: "id" },
      { text: "Delete", value: "actions", align: "center", sortable: false },
    ];

    // Function download results
    function getDownload(job) {
      console.log("Here!");
      console.log(job.results.id);
      httpClient
        .get("/download/stuff.zip", { responseType: "blob" })
        .then(({ data }) => {
          const downloadUrl = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.setAttribute("download", "file.zip");
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
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
      headers,
      loading,
      getDownload,
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
          <v-card-subtitle> simulates. </v-card-subtitle>

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
              <v-expansion-panel-content>
                <v-data-table
                  :headers="headers"
                  :items="state.userJobs.value.map((v) => v.node)"
                  :loading="loading"
                  class="elevation-1"
                >
                  <template v-slot:[`item.createdOn`]="{ item }">
                    <span>{{ new Date(item.created).toLocaleString() }}</span>
                  </template>
                  <template v-slot:[`item.download`]="{ item }">
                    <v-icon @click="getDownload(item)"> mdi-download </v-icon>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>
