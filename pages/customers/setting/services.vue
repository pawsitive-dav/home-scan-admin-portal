<!-- eslint-disable vue/valid-v-slot -->
<template>
  <cp-card class="pa-6">
    <v-data-table
      :headers="headers"
      :items="serviceDataList"
      :search="search"
      :loading="tableLoading"
      class="elevation-0"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Services List</v-toolbar-title>
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
          <v-btn
            color="primary"
            elevation="0"
            @click="createModal.dialog = true"
          >
            <v-icon left>mdi-plus</v-icon>
            <div class="cp-text-capitalize">Service</div>
          </v-btn>
        </v-toolbar>
      </template>

      <template #item.actions="{ item }">
        <v-menu offset-y left content-class="layout-menu">
          <template #activator="{ on, attrs }">
            <v-btn color="primary" elevation="0" v-bind="attrs" icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list nav dense>
            <v-list-item
              @click="
                ;(createModal.dialog = true),
                  (createModal.edit = true),
                  (createModal.editData = item)
              "
            >
              <v-list-item-title>
                <span class="px-2">Edit</span>
              </v-list-item-title>
            </v-list-item>

            <v-hover v-if="role == 'System Admin'" v-slot="{ hover }">
              <v-list-item
                :class="{ 'red lighten-5 error--text': hover }"
                @click="
                  ;(deleteModal.dialog = true),
                    (deleteModal.serviceId = item.service_id)
                "
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

    <!-- Modal Create & Edit -->
    <v-dialog
      v-model="createModal.dialog"
      :persistent="createModal.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          {{ createModal.edit ? 'Edit' : 'Create' }} Service
          <v-spacer />
          <v-btn
            :disabled="createModal.loading"
            icon
            class="mt-n4 mr-n4"
            @click="createModal.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="formCreate" v-model="createModal.valid" lazy-validation>
            <cp-label> Group </cp-label>
            <v-text-field
              v-model="createModal.serviceGroup"
              :rules="createModal.groupRules"
              :disabled="createModal.loading"
              outlined
              dense
              required
            />
            <cp-label> Name </cp-label>
            <v-text-field
              v-model="createModal.serviceName"
              :rules="createModal.nameRules"
              :disabled="createModal.loading"
              outlined
              dense
              required
            />
          </v-form>
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              v-if="!createModal.edit"
              :disabled="!createModal.valid"
              :loading="createModal.loading"
              elevation="0"
              height="36"
              color="primary"
              @click="validateCreate()"
            >
              <div class="cp-text-capitalize">Create</div>
            </v-btn>
            <v-btn
              v-else
              :disabled="!createModal.valid"
              :loading="createModal.loading"
              elevation="0"
              height="36"
              color="primary"
              @click="validateCreate()"
            >
              <div class="cp-text-capitalize">Confirm</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal Delete -->
    <v-dialog
      v-model="deleteModal.dialog"
      :persistent="deleteModal.loading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          Delete Branch
          <v-spacer />
          <v-btn
            :disabled="deleteModal.loading"
            icon
            class="mt-n4 mr-n4"
            @click="deleteModal.dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this branch?
          <div class="mt-6 d-flex flex-row-reverse">
            <v-btn
              :loading="deleteModal.loading"
              elevation="0"
              height="36"
              color="error"
              @click="onDeleteAction()"
            >
              <div class="cp-text-capitalize">Delete</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
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
      { text: 'GROUP', value: 'service_group' },
      { text: 'NAME', value: 'service_name' },
      { text: 'ACTION', align: 'center', value: 'actions', sortable: false },
    ],
    serviceDataList: [],
    createModal: {
      edit: false,
      valid: false,
      dialog: false,
      loading: false,
      editData: null,
      serviceGroup: '',
      groupRules: [(v) => !!v || 'Required'],
      serviceName: '',
      nameRules: [(v) => !!v || 'Required'],
      serviceId: '',
    },
    deleteModal: {
      dialog: false,
      loading: false,
      serviceId: '',
    },
  }),

  computed: {
    ...mapState('user', ['role', 'appRoleListStatus']),
  },

  watch: {
    'createModal.dialog'(newValue) {
      if (!newValue) {
        this.createModal.serviceGroup = ''
        this.createModal.serviceName = ''
        this.createModal.edit = false
        this.createModal.editData = null
        this.$refs.formCreate.resetValidation()
      }
    },
    'createModal.editData'(newValue) {
      if (newValue) {
        this.createModal.serviceId = newValue.service_id
        this.createModal.serviceGroup = newValue.service_group
        this.createModal.serviceName = newValue.service_name
      }
    },
  },

  created() {
    this.getServiceList()
  },

  methods: {
    ...mapActions('user', ['getAccessToken']),
    ...mapActions('notify', ['onNotify']),

    async getServiceList() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.tableLoading = true
        this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/customer/setting/service/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            this.serviceDataList = data.data
            this.tableLoading = false
          })
          .catch((error) => {
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

    validateCreate() {
      if (this.$refs.formCreate.validate()) {
        if (!this.createModal.edit) {
          this.onCreateAction()
        } else {
          this.checkBeforeEdit()
        }
      }
    },

    async onCreateAction() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.createModal.loading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/customer/setting/service/create`,
            {
              service_group: this.createModal.serviceGroup,
              service_name: this.createModal.serviceName,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.createModal.loading = false
            this.getServiceList()
            this.onNotify({
              notifyValue: true,
              type: 'success',
              title: 'Success',
              message: 'Service is created.',
            })
            this.createModal.dialog = false
          })
          .catch((error) => {
            this.createModal.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'Error',
              message: error,
            })
          })
      }
    },

    checkBeforeEdit() {
      const groupBfore = this.createModal.editData.service_group
      const nameBfore = this.createModal.editData.service_name

      const groupAfter = this.createModal.serviceGroup
      const nameAfter = this.createModal.serviceName

      if (groupBfore === groupAfter && nameBfore === nameAfter) {
        this.onNotify({
          notifyValue: true,
          type: 'info',
          title: 'Infomation',
          message:
            'Seems like the data you intend to modify remains unchanged from the original.',
        })
      } else {
        this.onEditAction()
      }
    },

    async onEditAction() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.createModal.loading = true
        this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/customer/setting/service/edit`,
            {
              service_id: this.createModal.serviceId,
              service_group: this.createModal.serviceGroup,
              service_name: this.createModal.serviceName,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.createModal.loading = false
            this.getServiceList()
            this.onNotify({
              notifyValue: true,
              type: 'success',
              title: 'Success',
              message: 'Service is edited.',
            })
            this.createModal.dialog = false
          })
          .catch((error) => {
            this.createModal.loading = false
            this.onNotify({
              notifyValue: true,
              type: 'error',
              title: 'Error',
              message: error,
            })
          })
      }
    },

    async onDeleteAction() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        this.deleteModal.loading = true
        this.$axios
          .delete(
            `${process.env.API_ENDPOINT}/v1/customer/setting/service/delete`,
            {
              data: { service_id: this.deleteModal.serviceId },
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(({ data }) => {
            this.deleteModal.loading = false
            this.getServiceList()
            this.onNotify({
              notifyValue: true,
              type: 'success',
              title: 'Success',
              message: 'Service is deleted.',
            })
            this.deleteModal.dialog = false
          })
          .catch((error) => {
            this.deleteModal.loading = false
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
