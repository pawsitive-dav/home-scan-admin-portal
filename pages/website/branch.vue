<!-- eslint-disable vue/valid-v-slot -->
<template>
  <cp-card class="pa-6">
    <div class="cp-header-1">Developing...</div>
  </cp-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'

export default {
  data: () => ({
    branchDataList: [],
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
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/website/branch/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            console.log(data)
            this.branchDataList = data.data
          })
          .catch((error) => {
            console.log(error)
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
