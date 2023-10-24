<!-- eslint-disable vue/valid-v-slot -->
<template>
  <cp-card class="pa-6">
    <v-data-table
      :headers="headers"
      :items="adminDataList"
      :search="search"
      :loading="tableLoading"
      class="elevation-0"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>My Customers</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            outlined
            dense
          />
          <v-spacer />
          <v-btn color="primary" elevation="0">
            <v-icon left>mdi-plus</v-icon>
            <div class="cp-text-capitalize">Customer</div>
          </v-btn>
        </v-toolbar>
      </template>

      <template #no-data>
        <div class="my-6">No data available in table.</div>
      </template>
    </v-data-table>
  </cp-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'

export default {
  data: () => ({
    tableLoading: false,
    search: '',
    headers: [
      { text: 'TAG', value: 'tag' },
      { text: 'FULL NAME', value: 'full_name' },
      { text: 'MOBILE NUMBER', value: 'mobile_number' },
      { text: 'TAG', value: 'image_alt' },
      { text: 'LINK', value: 'promotion_link' },
      { text: 'ACTION', align: 'center', value: 'actions', sortable: false },
    ],
    adminDataList: [],
  }),

  computed: {
    ...mapState('user', ['appRoleListStatus']),
  },

  created() {
    this.getBranchList()
  },

  methods: {
    ...mapActions('user', ['getAccessToken']),
    ...mapActions('notify', ['onNotify']),

    async getBranchList() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.tableLoading = true
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/customer/admin/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            console.log(data)
            this.adminDataList = data.data
            this.tableLoading = false
          })
          .catch((error) => {
            console.log(error)
            this.tableLoading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'Error',
              message: error,
            })
          })
      }
    },

    formaDateTime(dateTimeStr) {
      const dateTime = moment(dateTimeStr)
      const thaiDateTime = dateTime.format('DD-MM-YYYY HH:mm:ss')
      return thaiDateTime
    },
  },
}
</script>
