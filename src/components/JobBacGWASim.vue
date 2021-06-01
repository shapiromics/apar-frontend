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
      openedPanelParameters: null,
    });

    const form = reactive({
      submitSuccessMessage: "",
    });

    const params_form = reactive({
      // Genome simulation parameters
      num_species: 40,
      genome_length: 2000,
      mutation_rate: 6,
      recomb_rate: 1,
      maf: 1,
      // Phenotype simulation parameters
      phen_type: "quant",
      num_causal_var: 16,
      causal_maf_min: 10,
      causal_maf_max: 40,
      causal_ld_max: 0.6,
      effect_size_odr: "2,3,4,7,10,11,15,20",
      phen_replication: 10,
      heritability: 100,
      disease_prevalence: 50,
      case: 20,
      control: 20,
      // Linkage Disequilibrium plotting parameters
      snp_limit: 200,
      ld_maf: 0.1,
    });

    // BacGWASim jobCreate mutation
    const submitBacGWASimJobMutation = gql`
      mutation submitBacGWASimJob($task: String!, $parameters: GenericScalar!) {
        bacgwasimJobCreate(input: { task: $task, parameters: $parameters }) {
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
      var percentages = [
        "mutation_rate", "recomb_rate", "maf",
        "causal_maf_min", "causal_maf_max",
        "heritability", "disease_prevalence",
      ];
      percentages.forEach(value => {
        params_form[value] = params_form[value] / 100
      })

      submitBacGWASimJob(
        {
          task: "BACGWASIM",
          parameters: params_form,
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
    const { loading, result, refetch } = useQuery(
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
      httpClient
        .get("/download/" + job.results.id + ".zip", { responseType: "blob" })
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
        refetch();
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
      params_form,
    };
  },
};
</script>

<template>
  <v-container class="my-4">
    <v-row>
      <v-col lg="10" offset-lg="1" xl="8" offset-xl="2">
        <v-card class="pa-4 my-4">
          <v-card-title>BacGWASim</v-card-title>
          <v-card-subtitle> A simulator for bacterial machine learning and genome-wide association studies. </v-card-subtitle>

          <v-expansion-panels v-model="state.openedPanel">
            <v-expansion-panel align="left" focusable>
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
                <v-expansion-panels v-model="state.openedPanelParameters">
                  <v-expansion-panel focusable>
                    <v-expansion-panel-header class="text-button">
                      Genome simulation parameters
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-form>
                        <v-container fill-height>
                          <form-slider
                            title="Number of samples"
                            units=""
                            min="20"
                            max="300"
                            v-model="params_form.num_species"
                          ></form-slider>
                          <form-slider
                            title="Genome length"
                            units="(bp)"
                            min="200"
                            max="10000"
                            v-model="params_form.genome_length"
                          ></form-slider>
                          <form-slider
                            title="Mutation rate"
                            units="(%)"
                            max="15"
                            step="0.1"
                            v-model="params_form.mutation_rate"
                          ></form-slider>
                          <form-slider
                            title="Recombination rate"
                            units="(%)"
                            max="15"
                            step="0.1"
                            v-model="params_form.recomb_rate"
                          ></form-slider>
                          <form-slider
                            title="MAF threshold"
                            units="(%)"
                            max="15"
                            step="0.1"
                            v-model="params_form.maf"
                          ></form-slider>
                        </v-container>
                      </v-form>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel focusable>
                    <v-expansion-panel-header class="text-button">
                      Phenotype simulation parameters
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row align="center">
                        <v-col cols="4"> Phenotype type </v-col>
                        <v-col cols="8" class="flex-center">
                          <v-radio-group v-model="params_form.phen_type" row>
                            <v-radio
                              label="Quantitative"
                              value="quant"
                            ></v-radio>
                            <v-radio
                              class="m-4"
                              label="Binary case-control"
                              value="binary"
                            ></v-radio>
                          </v-radio-group>
                          <v-row v-if="params_form.phen_type === 'binary'">
                            <v-col cols="1"> </v-col>
                            <v-col cols="5">
                              <v-text-field
                                v-model="params_form.case"
                                label="Case"
                              >
                              </v-text-field>
                            </v-col>
                            <v-col cols="5">
                              <v-text-field
                                v-model="params_form.control"
                                label="Control"
                              >
                              </v-text-field>
                            </v-col>
                            <v-col cols="1"> </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                      <form-slider
                        title="Minimum MAF of causal markers"
                        units="(%)"
                        max="100"
                        v-model="params_form.causal_maf_min"
                      ></form-slider>
                      <form-slider
                        title="Maximum MAF of causal markers"
                        units="(%)"
                        max="100"
                        v-model="params_form.causal_maf_max"
                      ></form-slider>
                      <form-slider
                        title="Maximum permitted R2"
                        units=""
                        max="1"
                        step="0.01"
                        v-model="params_form.causal_ld_max"
                      ></form-slider>
                      <form-slider
                        title="Heritability of phenotype"
                        units="(%)"
                        max="100"
                        v-model="params_form.heritability"
                      ></form-slider>
                      <form-slider
                        title="Prevalence of phenotype"
                        units="(%)"
                        max="100"
                        v-model="params_form.disease_prevalence"
                      ></form-slider>
                      <form-slider
                        title="Number of phenotype replication sets"
                        units=""
                        max="50"
                        v-model="params_form.phen_replication"
                      ></form-slider>
                      <form-slider
                        title="Number of causal markers"
                        units=""
                        max="64"
                        v-model="params_form.num_causal_var"
                      ></form-slider>
                      <v-row align="center">
                        <v-col cols="4">Effect sizes of causal markers</v-col>
                        <v-col cols="8">
                          <v-text-field v-model="params_form.effect_size_odr">
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel focusable>
                    <v-expansion-panel-header class="text-button">
                      Linkage disequilibrium plotting parameters
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <form-slider
                        title="Number of SNPs"
                        units=""
                        max="1000"
                        v-model="params_form.snp_limit"
                      ></form-slider>
                      <form-slider
                        title="Minimum R2 value"
                        units=""
                        max="1"
                        step="0.01"
                        v-model="params_form.ld_maf"
                      ></form-slider>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

                <v-row>
                  <v-btn class="pa-4 mx-2 my-6" @click="submitNewJob">
                    Submit
                  </v-btn>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel focusable>
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
.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
