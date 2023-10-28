<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div class="shadow-sm">
    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
      class="elevation-0"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Account Approval</v-toolbar-title>
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
        </v-toolbar>
      </template>

      <template #item.user="{ item }">
        <div class="col-user">
          <v-avatar size="40" color="primary">
            <img v-if="item.avatar_path" :src="item.avatar_path" />
            <span
              v-else
              style="
                text-transform: uppercase;
                font-size: 22px;
                font-weight: 500;
                color: #ffffff;
              "
            >
              {{ item.code_name[0] }}
            </span>
          </v-avatar>
          <div>
            <div class="cp-medium">
              {{ item.user.split('/')[1] + ' ' + item.user.split('/')[2] }}
            </div>
            <div class="cp-text-description">{{ item.user.split('/')[0] }}</div>
          </div>
        </div>
      </template>

      <template #item.account_status="{ item }">
        <div class="cp-text-capitalize">
          <v-chip
            label
            style="background-color: rgba(224, 148, 56, var(--opacity-2))"
          >
            <span style="color: var(--base-warning)">{{
              item.account_status
            }}</span>
          </v-chip>
        </div>
      </template>

      <template #item.created_at="{ item }">
        <div class="cp-text-capitalize">
          {{ formaDateTime(item.created_at) }}
        </div>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          color="error"
          elevation="0"
          small
          outlined
          @click=";(dialogReject = true), (rejectAccountSelect = item)"
        >
          <div class="cp-text-capitalize">Reject</div>
        </v-btn>
        <v-btn
          color="success"
          elevation="0"
          small
          @click=";(dialogApprove = true), (approveAccountSelect = item)"
        >
          <div class="cp-text-capitalize">Approve</div>
        </v-btn>
      </template>

      <template #no-data>
        <div class="my-6">No data available in table.</div>
      </template>
    </v-data-table>

    <!-- Modal Reject -->
    <v-dialog
      v-model="dialogReject"
      :persistent="modalLoading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          Reject Account
          <v-spacer />
          <v-btn
            :disabled="modalLoading"
            icon
            class="mt-n4 mr-n4"
            @click="dialogReject = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          Are you sure you want to reject this account?
          <v-card outlined class="mt-2">
            <div class="pa-2">
              <b>Name :</b>
              {{ rejectAccountSelect.first_name }}
              {{ rejectAccountSelect.last_name }}
            </div>
          </v-card>
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="modalLoading"
              elevation="0"
              height="36"
              color="error"
              @click="onAccountReject()"
            >
              <div class="cp-text-capitalize">Reject</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal Approve -->
    <v-dialog
      v-model="dialogApprove"
      :persistent="modalLoading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          Approve Account
          <v-spacer />
          <v-btn
            :disabled="modalLoading"
            icon
            class="mt-n4 mr-n4"
            @click="dialogApprove = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="pb-2">
            <b>Username :</b>
            {{ approveAccountSelect.username }}
          </div>
          <div class="pb-4">
            <b>Name :</b>
            {{ approveAccountSelect.first_name }}
            {{ approveAccountSelect.last_name }}
          </div>
          <cp-label>User Role</cp-label>
          <v-select
            v-model="approveRole"
            :items="roleList"
            :disabled="modalLoading"
            item-text="role_name"
            item-value="role_level"
            hide-details
            outlined
            dense
            required
          />
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="modalLoading"
              elevation="0"
              height="36"
              color="success"
              @click="onAccountApprove()"
            >
              <div class="cp-text-capitalize">Approve</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'

export default {
  data: () => ({
    search: '',
    headers: [
      {
        text: 'USER',
        sortable: false,
        value: 'user',
      },
      { text: 'CODE NAME', value: 'code_name' },
      { text: 'STATUS', value: 'account_status' },
      { text: 'REGISTER DATE', value: 'created_at' },
      { text: 'ACTION', align: 'center', value: 'actions', sortable: false },
    ],
    desserts: [],
    modalLoading: false,
    // Reject Modal
    dialogReject: false,
    rejectAccountSelect: '',
    // Approve Modal
    dialogApprove: false,
    approveAccountSelect: '',
    approveRole: 0,
    roleList: null,
  }),

  computed: {
    ...mapState('user', ['appRoleList']),
  },

  watch: {
    dialogApprove(newValue) {
      if (!this.roleList && newValue) {
        this.approveRole = this.appRoleList[0].role_level
        const setRole = this.appRoleList.filter(
          (obj) => obj.role_name !== 'System Admin'
        )
        this.roleList = setRole
      }
    },
  },

  created() {
    this.getAccountApproval()
  },

  methods: {
    ...mapActions('user', ['getAccessToken']),
    ...mapActions('notify', ['onNotify']),
    async getAccountApproval() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        await this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/auth/account/approval`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            if (data) {
              this.dataTableMaping(data.data)
            }
          })
      }
    },
    dataTableMaping(data) {
      for (let i = 0; i < data.length; i++) {
        data[i].user =
          data[i].username + '/' + data[i].first_name + '/' + data[i].last_name
      }
      this.desserts = data
    },
    formaDateTime(dateTimeStr) {
      const dateTime = moment(dateTimeStr)
      const thaiDateTime = dateTime.format('DD-MM-YYYY HH:mm:ss')
      return thaiDateTime
    },
    async onAccountReject() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.modalLoading = true
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/auth/account/reject`,
            {
              account_id: this.rejectAccountSelect.account_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            const setDelete = this.desserts.filter(
              (item) => item.account_id !== this.rejectAccountSelect.account_id
            )
            this.desserts = setDelete
            this.modalLoading = false
            this.dialogReject = false
            this.onNotify({
              notifyValue: true,
              type: 'success',
              title: 'Success',
              message:
                'Account ' + this.rejectAccountSelect.username + 'is rejected.',
            })
          })
          .catch((error) => {
            this.modalLoading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'Error',
              message: error,
            })
          })
      }
    },
    async onAccountApprove() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.modalLoading = true
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/auth/account/approval`,
            {
              account_id: this.approveAccountSelect.account_id,
              app_role: this.approveRole,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            const setDelete = this.desserts.filter(
              (item) => item.account_id !== this.approveAccountSelect.account_id
            )
            this.desserts = setDelete
            this.modalLoading = false
            this.dialogApprove = false
            this.onNotify({
              notifyValue: true,
              type: 'success',
              title: 'Success',
              message:
                'Account ' +
                this.approveAccountSelect.username +
                'is approved.',
            })
          })
          .catch((error) => {
            this.modalLoading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'Error',
              message: error,
            })
          })
      }
    },
  },
}
</script>

<style scoped>
.col-user {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 12px 0;
  gap: 16px;
}
</style>
