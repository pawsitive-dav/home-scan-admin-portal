<template>
  <div class="bg-auth">
    <div class="bg-auth-container">
      <div class="graphic-box-1"></div>
      <div class="graphic-box-2"></div>
      <div class="graphic-box-3"></div>
      <div class="graphic-box-4"></div>
      <v-snackbar
        v-model="snackbarControl.value"
        :timeout="5000"
        color="error"
        top
      >
        <span class="cp-medium">
          {{ snackbarControl.message }}
        </span>
      </v-snackbar>
      <div class="bg-auth-card">
        <div class="bg-auth-card-header">
          <div
            style="
              font-size: 30px;
              width: 120px;
              height: 120px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-weight: 700;
              background-color: #e1e1e1;
              margin: auto;
              border-radius: 20px;
            "
          >
            LOGO
          </div>
        </div>
        <div class="bg-auth-card-body">
          <div class="text-center cp-title cp-medium my-4">
            Welcome to Admin Portal
          </div>
          <v-form ref="formLogin" v-model="valid" lazy-validation>
            <cp-label>Username</cp-label>
            <v-text-field
              v-model="username"
              :rules="usernameRules"
              :disabled="onLoading"
              name="username"
              outlined
              dense
              required
            />
            <cp-label for="password">Password</cp-label>
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              :disabled="onLoading"
              :append-icon="
                showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
              "
              :type="showPassword ? 'text' : 'password'"
              name="password"
              outlined
              dense
              required
              @click:append="showPassword = !showPassword"
              @keyup.enter="validate()"
            />
          </v-form>
          <div class="mt-4">
            <v-btn
              :disabled="!valid"
              :loading="onLoading"
              color="primary"
              elevation="0"
              height="42"
              block
              @click="validate()"
            >
              <div class="cp-text-capitalize">Sign In</div>
            </v-btn>
          </div>
        </div>
        <div class="bg-auth-card-footer pt-5">
          <div class="text-center">
            <span class="mr-2">New on our admin portal?</span>
            <a v-if="!onLoading" @click="$router.push('register')">
              Create an account
            </a>
            <span
              v-else
              style="
                color: var(--base-primary);
                cursor: default;
                font-weight: 500;
              "
            >
              Create an account
            </span>
          </div>
          <cp-divider text="or" />
          <div class="cp-caption text-center cp-text-description">
            If you
            <a v-if="!onLoading" @click="$router.push('forgot-password')">
              forgot your password
            </a>
            <span
              v-else
              style="
                color: var(--base-primary);
                cursor: default;
                font-weight: 500;
              "
            >
              forgot your password </span
            >, <br />
            please contact your project's owner.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginPage',
  data() {
    return {
      onLoading: false,
      valid: true,
      username: '',
      usernameRules: [(v) => !!v || 'Required'],
      password: '',
      passwordRules: [(v) => !!v || 'Required'],
      showPassword: false,
      snackbarControl: {
        value: false,
        message: '',
      },
    }
  },
  methods: {
    ...mapActions('user', ['setRefreshToken']),
    validate() {
      if (this.$refs.formLogin.validate()) {
        this.onLogin()
      }
    },
    async onLogin() {
      this.onLoading = true

      await this.$axios
        .post(`${process.env.AUTH_ENDPOINT}/v1/auth/login/portal`, {
          username: this.username,
          password: this.password,
        })
        .then(({ data }) => {
          if (data) {
            const hashToken = btoa(data.data.refreshToken)
            localStorage.setItem('_cp_scpoe', hashToken)
            this.setRefreshToken()
            this.$router.push('/')
          }
        })
        .catch((error) => {
          if (error.response) {
            const errorData = error.response.data
            if (errorData.statusCode === 401) {
              this.$router.push('wait-for-approve')
            } else {
              this.snackbarControl.value = true
              this.onLoading = false
              this.snackbarControl.message =
                'Username or Password is incorrect!'
            }
          } else if (error.request) {
            // The request was made but no response was received
            this.snackbarControl.value = true
            this.onLoading = false
            this.snackbarControl.message =
              'No response received from server: ' + error.message
          } else {
            this.snackbarControl.value = true
            this.onLoading = false
            // Something happened in setting up the request that triggered an error
            this.snackbarControl.message =
              'Error setting up the request: ' + error.message
          }
        })
    },
  },
}
</script>

<style scoped>
.bg-auth {
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fafafa;
}
.bg-auth-container {
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 450px;
  max-height: fit-content;
  transition: all ease 1s;
}
.bg-auth-card {
  position: relative;
  z-index: 10;
  padding: var(--spacing-7);
  border-radius: var(--spacing-3);
  background-color: var(--base-light);
  box-shadow: var(--box-shadow-md);
}
</style>
