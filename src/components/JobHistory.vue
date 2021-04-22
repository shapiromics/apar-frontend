<script>
import { reactive } from "@vue/composition-api";
import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default {
  name: "JobHistory",
  setup() {
    const state = reactive({
      userJobs: null,
    });

    // userJobHistory query
    const { loading, result, refetch } = useQuery(
      gql`
        query {
          userJobs {
            edges {
              node {
                id
                task
                status
                created
                label
                user {
                  username
                }
              }
            }
          }
        }
      `,
      null,
      { pollInterval: 1000 }
    );
    state.userJobs = useResult(result, [], (data) => data.userJobs.edges);

    // deleteJobResults mutation
    const jobDeleteMutation = gql`
      mutation jobDelete($job_id: String!) {
        jobDelete(input: { jobId: $job_id }) {
          success
        }
      }
    `;
    const { mutate: jobDelete } = useMutation(jobDeleteMutation);
    function deleteJob(job) {
      jobDelete({ job_id: job.id });
      refetch();
    }

    function getResults(job) {
      console.log("Getting results for:");
      console.log(job);
    }

    // Job status colors
    function getColor(status) {
      switch (status) {
        case "COMPLETED":
          return "green";
        case "RUNNING":
          return "orange";
        case "REQUESTED":
          return "blue";
        case "ERROR":
          return "red";
        case "FAILED":
          return "red";
      }
    }

    const headers = [
      { text: "Task", value: "task" },
      { text: "Label", value: "label" },
      { text: "Status", value: "status" },
      { text: "Result", value: "result", align: "center", sortable: false },
      { text: "Created", value: "createdOn" },
      { text: "jobID", value: "id" },
      { text: "Delete", value: "actions", align: "center", sortable: false },
    ];

    return {
      state,
      loading,
      headers,
      getColor,
      deleteJob,
      getResults,
    };
  },
};
</script>

<template>
  <v-container class="my-6">
    <v-row>
      <v-col lg="10" offset-lg="1" md="12" offset-md="0">
        <v-card class="pa-4">
          <h1 class="v-heading text-h3 mb-4">Job History</h1>
          <v-data-table
            :headers="headers"
            :items="state.userJobs.map((v) => v.node)"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:[`item.status`]="{ item }">
              <v-chip dark :color="getColor(item.status)">
                {{ item.status }}
              </v-chip>
            </template>
            <template v-slot:[`item.createdOn`]="{ item }">
              <span>{{ new Date(item.created).toLocaleString() }}</span>
            </template>
            <template v-slot:[`item.result`]="{ item }">
              <v-icon @click="getResults(item)"> mdi-eye </v-icon>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon @click="deleteJob(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>
