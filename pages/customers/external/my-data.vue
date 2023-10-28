<!-- eslint-disable vue/valid-v-slot -->
<template>
  <cp-card class="pa-6">
    <v-data-table
      :headers="headers"
      :items="adminDataList"
      :search="search"
      :loading="tableLoading"
      fixed
      class="elevation-0"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Backlog Data List</v-toolbar-title>
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
            <v-icon left>mdi-progress-question</v-icon>
            <div class="cp-text-capitalize">Verify All</div>
          </v-btn>
        </v-toolbar>
      </template>

      <template #item.data_status="{ item }">
        <cp-col min="70">
          {{ item.data_status }}
        </cp-col>
      </template>

      <template #item.full_name="{ item }">
        <cp-col min="150">
          {{ item.full_name }}
        </cp-col>
      </template>

      <template #item.mobile_number="{ item }">
        <cp-col min="90">
          {{ formatMobileNumber(item.mobile_number) }}
        </cp-col>
      </template>

      <template #item.branch_selected="{ item }">
        <cp-col min="150">
          {{ item.branch_selected }}
        </cp-col>
      </template>

      <template #item.customer_message="{ item }">
        <cp-col min="150">
          {{ item.customer_message ? item.customer_message : '-' }}
        </cp-col>
      </template>

      <template #item.register_from="{ item }">
        <cp-col min="80">
          {{ item.register_from }}
        </cp-col>
      </template>

      <template #item.created_at="{ item }">
        <cp-col min="130">
          {{ formaDateTime(item.created_at) }}
        </cp-col>
      </template>

      <template #item.actions="{ item }">
        <v-menu offset-y left content-class="layout-menu">
          <template #activator="{ on, attrs }">
            <v-btn
              :disabled="item.member_role === 'System Admin'"
              color="primary"
              elevation="0"
              v-bind="attrs"
              icon
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list nav dense>
            <v-list-item>
              <v-list-item-title>
                <span class="px-2">Activating</span>
              </v-list-item-title>
            </v-list-item>

            <v-hover v-if="role == 'System Admin'" v-slot="{ hover }">
              <v-list-item :class="{ 'red lighten-5 error--text': hover }">
                <v-list-item-title>
                  <span class="px-2">Delete</span>
                </v-list-item-title>
              </v-list-item>
            </v-hover>
          </v-list>
        </v-menu>
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
      {
        text: 'STATUS',
        value: 'data_status',
        align: 'center',
        sortable: false,
      },
      { text: 'FULL NAME', value: 'full_name' },
      { text: 'BRANCH', value: 'branch_selected' },
      { text: 'MESSAGE', value: 'customer_message' },
      { text: 'FROM', value: 'register_from' },
      { text: 'REGISTER AT', value: 'created_at' },
      { text: 'ACTION', align: 'center', value: 'actions', sortable: false },
    ],
    adminDataList: [],
  }),

  computed: {
    ...mapState('user', ['role', 'appRoleListStatus']),
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
          .get(`${process.env.API_ENDPOINT}/v1/customer/data/backlog/get`, {
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

    formatMobileNumber(number) {
      const cleanedNumber = number.replace(/\D/g, '')
      if (cleanedNumber.length === 10) {
        return cleanedNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
      } else {
        return 'Invalid number'
      }
    },
  },
}
</script>
