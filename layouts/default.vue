<template>
  <v-app>
    <page-loading />

    <v-navigation-drawer v-model="drawer" fixed app>
      <v-toolbar elevation="0">
        <v-icon size="50" color="#265b7f" class="mr-3">
          mdi-alpha-a-circle
        </v-icon>
        <span class="cp-title cp-semibold"> Admin Portal</span>
      </v-toolbar>

      <treeview-sidebar />
    </v-navigation-drawer>

    <v-app-bar elevation="0" color="transparent" fixed app>
      <div class="cp-appbar-container">
        <div class="cp-appbar">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

          <v-spacer />

          <member-menu />
        </div>
      </div>
    </v-app-bar>

    <v-main class="cp-main-bg">
      <v-container fluid class="pa-6 mb-5">
        <Nuxt />
      </v-container>
    </v-main>

    <toast-bar />

    <v-footer
      app
      inset
      absolute
      color="transparent"
      class="px-6 py-4 cp-caption"
    >
      <span>
        Copyright © {{ new Date().getFullYear() }} <b>Admin Portal</b> All
        rights reserved.</span
      >
      <v-spacer />
      <a class="mx-2">Documentation</a>
      <a class="mx-2">Support</a>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: true,
    }
  },
  computed: {
    ...mapState('user', ['refreshToken']),
  },
  watch: {
    refreshToken(newValue) {
      if (newValue) {
        this.getMyProfile()
        this.getAppRole()
      }
    },
  },
  methods: {
    ...mapActions('user', [
      'getAccessToken',
      'setMemberInfo',
      'setAppRole',
      'setAppRoleStatus',
    ]),
    async getMyProfile() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        await this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/member/my-information`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            if (data) {
              const res = data.data
              const obj = {
                accountId: res.account_id,
                avatarPath: res.avatar_path,
                firstName: res.first_name,
                lastName: res.last_name,
                codeName: res.code_name,
                role: res.member_role,
              }
              this.setMemberInfo(obj)
            }
          })
          .catch((error) => {
            alert(error)
          })
      }
    },
    async getAppRole() {
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        await this.$axios
          .get(`${process.env.API_ENDPOINT}/v1/role/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(({ data }) => {
            const setRole = data.data.sort(
              (a, b) => b.role_level - a.role_level
            )
            for (let i = 0; i < setRole.length; i++) {
              this.setAppRole(setRole[i])
            }
            this.setAppRoleStatus()
          })
          .catch((error) => {
            alert(error)
          })
      }
    },
  },
}
</script>

<style lang="scss">
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
</style>
