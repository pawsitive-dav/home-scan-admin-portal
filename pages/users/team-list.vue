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
        <div class="cp-text-capitalize">
          {{ item.member_role }}
        </div>
      </template>

      <template #item.account_status="{ item }">
        <div class="cp-text-capitalize">
          {{ item.account_status }}
        </div>
      </template>

      <template #item.actions>
        <v-btn color="primary" elevation="0" small outlined>
          <div class="cp-text-capitalize">More</div>
        </v-btn>
      </template>

      <template #no-data>
        <div class="my-6">No data available in table.</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

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
      { text: 'Actions', align: 'center', value: 'actions', sortable: false },
    ],
    desserts: [],
  }),

  created() {
    this.getTeamList()
  },

  methods: {
    ...mapActions('user', ['getAccessToken']),
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
              this.avatarMapping(data.data)
            }
          })
          .catch((error) => {
            alert(error)
          })
      }
    },
    async avatarMapping(data) {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        const avatarPromises = data.map(async (item) => {
          const avatarImage = await this.getAvatar(
            item.avatar_path,
            accessToken
          )
          return { ...item, avatar_path: avatarImage }
        })

        const updatedData = await Promise.all(avatarPromises)
        for (let i = 0; i < updatedData.length; i++) {
          updatedData[i].user =
            updatedData[i].username +
            '/' +
            updatedData[i].first_name +
            '/' +
            updatedData[i].last_name
        }

        this.desserts = updatedData
      }
    },

    async getAvatar(imageId, accessToken) {
      try {
        const response = await this.$axios.get(
          `${process.env.API_ENDPOINT}/v1/avatar/read/${imageId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
        return response.data.data
      } catch (error) {
        console.error('Error getting avatar:', error)
        return null // Handle the error appropriately based on your use case
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
