<!-- eslint-disable vue/valid-v-slot -->
<template>
  <cp-card class="pa-6">
    <div class="cp-header-1">Developing...</div>
  </cp-card>
  <!-- <div v-if="PublicPromotion">
    <div class="py-4 d-flex align-center">
      <div class="cp-title mr-auto">
        Public Promotions {{ '(' + PublicPromotion.length + '/5)' }}
      </div>
      <div>
        Display :
        <v-btn
          v-for="item in display.list"
          :key="item"
          color="primary"
          class="ml-3"
          small
          :outlined="display.select != item"
          @click="display.select = item"
        >
          {{ item }}
        </v-btn>
      </div>
    </div>

    <cp-card class="pa-4">
      <v-card-text>
        <v-tabs>
          <v-tab v-for="(list, x) in PublicPromotion" :key="x" @click="tab = x">
            {{ list.promotion_name }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(list, i) in PublicPromotion" :key="i">
            <v-card flat>
              <v-card-text>{{ list }}</v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </cp-card>

    <cp-card class="mt-6 pa-4">
      <v-data-table
        :headers="headers"
        :items="promotionDataList"
        :search="search"
        class="elevation-0"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Promotion List</v-toolbar-title>
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
              <div class="cp-text-capitalize">Promotion</div>
            </v-btn>
          </v-toolbar>
        </template>

        <template #item.image_alt="{ item }">
          {{ item.image_alt ? item.image_alt : '-' }}
        </template>

        <template #item.promotion_link="{ item }">
          <span v-if="!item.promotion_link">-</span>
          <a v-else :href="item.promotion_link" target="”_blank”">{{
            item.promotion_link
          }}</a>
        </template>

        <template #no-data>
          <div class="my-6">No data available in table.</div>
        </template>
      </v-data-table>
    </cp-card>
  </div> -->
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import CpCard from '~/components/CpCard.vue'

export default {
  components: { CpCard },
  data: () => ({
    PublicPromotion: [],
    promotionDataList: [],
    tab: 0,
    display: {
      select: 'desktop',
      list: ['desktop', 'teblet', 'mobile'],
    },
    search: '',
    headers: [
      { text: 'PREVIEW', value: 'promotion_id' },
      { text: 'NAME', value: 'promotion_name' },
      { text: 'STATUS', value: 'promotion_status' },
      { text: 'TAG', value: 'image_alt' },
      { text: 'LINK', value: 'promotion_link' },
      { text: 'ACTION', align: 'center', value: 'actions', sortable: false },
    ],
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
          .get(`${process.env.API_ENDPOINT}/v1/website/promotion/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            console.log(data)
            this.promotionDataList = data.data
            this.PublicPromotion = this.promotionDataList.filter(
              (item) => item.promotion_status === 'publish'
            )
          })
          .catch((error) => {
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
