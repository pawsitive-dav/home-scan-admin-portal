<template>
  <div class="cp-dashboard">
    <v-card width="100%" height="600">
      <v-card-text>
        <div class="cp-header-1">Dashboard</div>
        <div>Developing...</div>
        <v-btn color="primary" @click="mockupData()">text</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  methods: {
    mockupData() {
      console.log('mockup')
    },
  },
}
</script>
