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
          <v-toolbar-title>Team List</v-toolbar-title>
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

      <template #item.member_role="{ item }">
        <v-chip
          v-if="item.member_role === 'System Admin'"
          class="mr-1"
          style="background-color: rgba(23, 26, 28, var(--opacity-2))"
        >
          <v-icon size="18"> mdi-account-cog-outline </v-icon>
        </v-chip>
        <v-chip
          v-else-if="item.member_role === 'App Owner'"
          class="mr-1"
          style="background-color: rgba(76, 168, 248, var(--opacity-2))"
        >
          <v-icon size="18" style="color: var(--base-info)">
            mdi-account-tie-outline
          </v-icon>
        </v-chip>
        <v-chip
          v-else-if="item.member_role === 'Employee'"
          class="mr-1"
          style="background-color: rgba(76, 168, 248, var(--opacity-2))"
        >
          <v-icon size="18" style="color: var(--base-info)">
            mdi-account
          </v-icon>
        </v-chip>
        <v-chip
          v-else-if="item.member_role === 'Freelance'"
          class="mr-1"
          style="background-color: rgba(76, 168, 248, var(--opacity-2))"
        >
          <v-icon size="18" style="color: var(--base-info)">
            mdi-account-outline
          </v-icon>
        </v-chip>
        <v-chip
          v-else-if="item.member_role === 'Branch'"
          class="mr-1"
          style="background-color: rgba(76, 168, 248, var(--opacity-2))"
        >
          <v-icon size="18" style="color: var(--base-info)">
            mdi-home-account
          </v-icon>
        </v-chip>
        {{ item.member_role ? item.member_role : '-' }}
      </template>

      <template #item.account_status="{ item }">
        <div class="cp-text-capitalize">
          <v-chip
            v-if="item.account_status === 'active'"
            label
            style="background-color: rgba(54, 188, 117, var(--opacity-2))"
          >
            <v-icon size="18" class="mr-1" style="color: var(--base-success)">
              mdi-check
            </v-icon>
            <span class="success--text">
              {{ item.account_status }}
            </span>
          </v-chip>
          <v-chip
            v-else
            label
            style="background-color: rgba(23, 26, 28, var(--opacity-2))"
          >
            <v-icon size="18" class="mr-1"> mdi-cancel </v-icon>
            {{ item.account_status }}
          </v-chip>
        </div>
      </template>

      <template #item.last_login="{ item }">
        <span v-if="item.last_login">{{ formaDateTime(item.last_login) }}</span>
        <span v-else class="cp-text-description">
          The user has not yet logged in.
        </span>
      </template>

      <template #item.actions="{ item }">
        <v-menu offset-y left content-class="layout-menu">
          <template #activator="{ on, attrs }">
            <v-btn
              :disabled="item.member_role === 'System Admin'"
              color="primary"
              elevation="0"
              v-bind="attrs"
              v-on="on"
            >
              <div class="cp-text-capitalize">More</div>
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list nav>
            <v-list-item
              v-if="item.account_status === 'active'"
              @click=";(dialogSuspend = true), (suspendSelect = item)"
            >
              <v-list-item-title>
                <span class="px-2">Suspend</span>
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              v-else
              @click=";(dialogActive = true), (activeSelect = item)"
            >
              <v-list-item-title>
                <span class="px-2">Activating</span>
              </v-list-item-title>
            </v-list-item>

            <v-hover v-if="role == 'System Admin'" v-slot="{ hover }">
              <v-list-item
                :class="{ 'red lighten-5 error--text': hover }"
                @click=";(dialogDelete = true), (deleteSelect = item)"
              >
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

    <!-- Modal Suspend -->
    <v-dialog
      v-model="dialogSuspend"
      :persistent="modalLoading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          Suspend Account
          <v-spacer />
          <v-btn
            :disabled="modalLoading"
            icon
            class="mt-n4 mr-n4"
            @click="dialogSuspend = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          Are you sure you want to suspend this account?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="modalLoading"
              elevation="0"
              height="42"
              color="primary"
              @click="onSuspendAccount()"
            >
              <div class="cp-text-capitalize">Suspend</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal Active -->
    <v-dialog
      v-model="dialogActive"
      :persistent="modalLoading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          Activating Account
          <v-spacer />
          <v-btn
            :disabled="modalLoading"
            icon
            class="mt-n4 mr-n4"
            @click="dialogActive = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          When you enable the usage of this account, the system will change the
          status of this account to Active.
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="modalLoading"
              elevation="0"
              height="42"
              color="primary"
              @click="onActiveAccount()"
            >
              <div class="cp-text-capitalize">Confirm</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal Delete -->
    <v-dialog
      v-model="dialogDelete"
      :persistent="modalLoading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          Delete Account
          <v-spacer />
          <v-btn
            :disabled="modalLoading"
            icon
            class="mt-n4 mr-n4"
            @click="dialogDelete = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this account?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="modalLoading"
              elevation="0"
              height="42"
              color="error"
              @click="onDeleteAccount()"
            >
              <div class="cp-text-capitalize">Delete</div>
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
      { text: 'ROLE', value: 'member_role' },
      { text: 'CODE NAME', value: 'code_name' },
      { text: 'STATUS', value: 'account_status' },
      { text: 'LAST LOGIN', value: 'last_login' },
      { text: 'CODE', value: 'reset_password_code' },
      { text: 'Actions', align: 'center', value: 'actions', sortable: false },
    ],
    desserts: [],
    modalLoading: false,
    dialogSuspend: false,
    suspendSelect: null,
    dialogActive: false,
    activeSelect: null,
    dialogDelete: false,
    deleteSelect: null,
  }),

  computed: {
    ...mapState('user', ['appRoleListStatus', 'appRoleList', 'role']),
  },

  watch: {
    appRoleListStatus(newValue) {
      if (newValue) this.getTeamList()
    },
  },

  created() {
    if (this.appRoleListStatus) this.getTeamList()
  },

  methods: {
    ...mapActions('user', ['getAccessToken']),
    ...mapActions('notify', ['onNotify']),

    async getTeamList() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        await this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/member/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            if (data) {
              this.dataTableMaping(data.data)
            }
          })
          .catch((error) => {
            alert(error)
          })
      }
    },

    dataTableMaping(data) {
      for (let i = 0; i < data.length; i++) {
        data[i].user =
          data[i].username + '/' + data[i].first_name + '/' + data[i].last_name

        const getRole = this.appRoleList.find(
          (role) => role.role_level === Number(data[i].member_role)
        )
        data[i].member_role = getRole.role_name ? getRole.role_name : '-'
      }
      data.sort((a, b) => {
        const accountStatusA = a.account_status.toLowerCase()
        const accountStatusB = b.account_status.toLowerCase()
        if (accountStatusA < accountStatusB) return -1
        if (accountStatusA > accountStatusB) return 1
        return 0
      })
      this.desserts = data
    },

    formaDateTime(dateTimeStr) {
      const dateTime = moment(dateTimeStr)
      const thaiDateTime = dateTime.format('DD-MM-YYYY HH:mm:ss')
      return thaiDateTime
    },

    async onSuspendAccount() {
      this.modalLoading = true
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/auth/account/set-suspend`,
            {
              account_id: this.suspendSelect.account_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.modalLoading = false
            this.dialogSuspend = false
            this.onNotify({
              notifyValue: true,
              type: 'success',
              title: 'Success',
              message:
                'Account ' + this.suspendSelect.username + ' is suspended.',
            })
            this.getTeamList()
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

    async onActiveAccount() {
      this.modalLoading = true
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/auth/account/set-active`,
            {
              account_id: this.activeSelect.account_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.modalLoading = false
            this.dialogActive = false
            this.onNotify({
              notifyValue: true,
              type: 'success',
              title: 'Success',
              message: 'Account ' + this.activeSelect.username + ' is actived.',
            })
            this.getTeamList()
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

    async onDeleteAccount() {
      this.modalLoading = true
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/auth/account/set-delete`,
            {
              account_id: this.deleteSelect.account_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.modalLoading = false
            this.dialogDelete = false
            this.onNotify({
              notifyValue: true,
              type: 'success',
              title: 'Success',
              message: 'Account ' + this.deleteSelect.username + ' is deleted.',
            })
            this.getTeamList()
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
.layout-menu {
  box-shadow: var(--box-shadow-md);
}
</style>
