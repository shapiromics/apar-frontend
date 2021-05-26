<script>
export default {
  props: {
    min: { type: [Number, String], default: 0 },
    max: { type: [Number, String], default: 100 },
    title: { type: String, default: "Title" },
    units: { type: String, default: "(un)" },
    step: { type: [Number, String], default: 1}
  },
};
</script>

<template>
  <v-row align="center">
    <v-col cols="3" > {{ title }} </v-col>
    <v-col cols="1" > {{ units }} </v-col>
    <v-col cols="8">
      <v-slider
        v-bind="$attrs"
        v-on="$listeners"
        class="align-center"
        :max="max"
        :min="min"
        :step=step
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-bind="$attrs"
            v-on="$listeners"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
          ></v-text-field>
        </template>
      </v-slider>
    </v-col>
  </v-row>
</template>