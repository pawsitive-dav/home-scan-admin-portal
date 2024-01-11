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
      <div class="mx-2">Version: 1.10.4</div>
    </v-footer>

    <!-- <div v-if="displayBlock" class="cp-display-block">
      <div class="text-center">
        <v-img
          :src="require('@/assets/images/logo-white.svg')"
          width="200"
          class="mx-auto"
        />
        <v-divider class="mt-6 mb-4 white" />
        <div class="cp-title mt-4 white--text">ไม่รองรับขนาดหน้าจอนี้</div>
      </div>
    </div> -->
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'DefaultLayout',

  data() {
    return {
      drawer: true,
      windowWidth: 0,
      displayBlock: false,
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

  // mounted() {
  //   // เพิ่ม event listener เพื่อตรวจสอบความกว้างของหน้าต่างเมื่อ component ถูก mount
  //   this.getWindowWidth()
  //   window.addEventListener('resize', this.getWindowWidth)
  // },
  // beforeDestroy() {
  //   // ลบ event listener เมื่อ component ถูก destroy เพื่อป้องกันการหลุด memory
  //   window.removeEventListener('resize', this.getWindowWidth)
  // },

  methods: {
    ...mapActions('user', [
      'getAccessToken',
      'setMemberInfo',
      'setAppRole',
      'setAppRoleStatus',
    ]),

    // getWindowWidth() {
    //   // ดึงค่าความกว้างของหน้าต่าง
    //   this.windowWidth = window.innerWidth

    //   if (this.windowWidth < 768) {
    //     if (!this.displayBlock) {
    //       this.displayBlock = true
    //     }
    //   } else if (this.displayBlock) {
    //     this.displayBlock = false
    //   }
    // },

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
.cp-display-block {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 99;
  width: 100%;
  height: 100vh;
  background-color: var(--base-success);
}
</style>
