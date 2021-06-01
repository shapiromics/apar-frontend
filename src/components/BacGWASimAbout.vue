<script>
export default {
  name: "BacGWASimAbout",
  setup() {},
};
</script>

<template>
  <v-container class="my-4" fluid>
    <v-row>
      <v-col lg="10" offset-lg="1" xl="8" offset-xl="2">
        <v-card class="pa-4 my-4">
          <v-card-title>BacGWASim</v-card-title>
          <v-card-subtitle>
            A simulator for bacterial machine learning and genome-wide
            association studies.
          </v-card-subtitle>
            <v-row class="mx-4 mb-2">
            <a href="https://github.com/Morteza-M-Saber/BacGWASim">
              <img
                class="mx-1"
                alt="GitHub"
                src="https://img.shields.io/conda/v/bioconda/BacGWASim?label=GitHub version"
              />
            </a>
            <a href="https://anaconda.org/bioconda/bacgwasim">
              <img
                class="mx-1"
                alt="Conda"
                src="https://anaconda.org/conda-forge/vsc-install/badges/installer/conda.svg"
              />
            </a>
            <span
              class="__dimensions_badge_embed__ mx-1"
              data-doi="10.1099/mgen.0.000337"
              data-legend="never"
              data-style="large_rectangle"
            ></span>
            </v-row>
          <v-card-text>
            Identification of genomic elements underlying bacterial phenotypes
            such as resistance to antibiotics, virulence and fermentation is a
            fundamental step for a better understanding of the molecular
            mechanisms of these traits, and may be able to inform new clinical,
            industrial and agricultural interventions.
          </v-card-text>
          <v-card-text>
            BacGWASim is designed to simulate whole-genomes and phenotypes of
            large bacterial populations focusing on unique characteristics of
            bacteria such as strong genome-wide linkage disequilibrium and
            population stratification. The data produced by BacGWASim provides a
            mean to 1) evaluate the power and limitations of existing bacterial
            Machine learning and Genome-Wide assoctation study methods and 2)
            develop and benchmark novel tools for bacterial genotype to
            phenotype mapping tools.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>