<template>
  <v-app>
    <page-loading />

    <v-navigation-drawer v-model="drawer" fixed app>
      <v-toolbar elevation="0" class="cp-header-3 cp-semibold">
        <span style="color: var(--base-primary)" class="mr-2">HomeScan</span>
        <span style="color: var(--base-success)">Secure</span>
      </v-toolbar>

      <treeview-sidebar />
    </v-navigation-drawer>

    <v-app-bar elevation="0" color="transparent" fixed app>
      <div class="cp-appbar-container">
        <div class="cp-appbar">
          <v-btn icon @click.stop="drawer = !drawer">
            <v-icon v-if="drawer">mdi-menu-open</v-icon>
            <v-icon v-else>mdi-menu-close</v-icon>
          </v-btn>

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
      <a class="mx-2">Version: 1.0.0</a>
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
      try {
        const accessToken = await this.getAccessToken()

        if (accessToken) {
          const response = await this.$axios.get(
            `${process.env.API_ENDPOINT}/v1/member/my-information`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )

          const data = response.data

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

            await this.setMemberInfo(obj)
            this.getAppRole()
          }
        }
      } catch (error) {
        console.error('Error in getMyProfile:', error)
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
              setRole[i].role_level = setRole[i].role_level.toString()
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
