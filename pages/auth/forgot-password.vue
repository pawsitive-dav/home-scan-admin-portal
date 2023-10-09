<template>
  <div class="bg-forgot">
    <div class="bg-forgot-container">
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
      <div class="bg-forgot-card">
        <div class="bg-forgot-card-body">
          <v-tabs-items v-model="tab">
            <v-tab-item value="tab-1">
              <div class="text-center cp-title cp-medium">
                Forgot Your Password?
              </div>
              <cp-divider text="Please enter your username to proceed." />
              <v-form
                ref="formUsername"
                v-model="validUsername"
                lazy-validation
              >
                <cp-label>Username</cp-label>
                <v-text-field
                  v-model="username"
                  :rules="usernameRules"
                  :disabled="onLoading"
                  outlined
                  dense
                  required
                />
              </v-form>
              <div class="mt-4">
                <v-btn
                  :disabled="!validUsername"
                  :loading="onLoading"
                  color="primary"
                  elevation="0"
                  height="42"
                  block
                  @click="validateUsername()"
                >
                  <div class="cp-text-capitalize">Next</div>
                </v-btn>
              </div>
            </v-tab-item>
            <v-tab-item value="tab-2">
              <div class="text-center cp-title cp-medium">
                Enter Reset Password CODE
              </div>
              <cp-divider text="Please enter your reset CODE to proceed." />
              <v-form
                ref="formResetCode"
                v-model="validResetCode"
                lazy-validation
              >
                <cp-label>Reset CODE</cp-label>
                <v-text-field
                  v-model="resetCode"
                  :rules="resetCodeRules"
                  :disabled="onLoading"
                  outlined
                  dense
                  required
                />
              </v-form>
              <div class="mt-4">
                <v-btn
                  :disabled="!validResetCode"
                  :loading="onLoading"
                  color="primary"
                  elevation="0"
                  height="42"
                  block
                  @click="validateResetCode()"
                >
                  <div class="cp-text-capitalize">Next</div>
                </v-btn>
              </div>
            </v-tab-item>
            <v-tab-item value="tab-3">
              <div class="text-center cp-title cp-medium">Reset Password</div>
              <cp-divider text="Please enter your new password." />
              <cp-label for="password">Password</cp-label>
              <v-form
                ref="formNewPassword"
                v-model="validNewPassword"
                lazy-validation
              >
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
                />
                <cp-label for="password">Confirm Password</cp-label>
                <v-text-field
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules"
                  :disabled="onLoading"
                  :append-icon="
                    showConfirmPassword
                      ? 'mdi-eye-outline'
                      : 'mdi-eye-off-outline'
                  "
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :error-messages="confirmPasswordError"
                  name="password"
                  outlined
                  dense
                  required
                  @click:append="showConfirmPassword = !showConfirmPassword"
                />
              </v-form>
              <div class="mt-4">
                <v-btn
                  :disabled="!validNewPassword"
                  :loading="onLoading"
                  color="primary"
                  elevation="0"
                  height="42"
                  block
                  @click="validateNewPassword()"
                >
                  <div class="cp-text-capitalize">Confirm</div>
                </v-btn>
              </div>
            </v-tab-item>
            <v-tab-item value="tab-4">
              <div class="text-center">
                <v-icon color="success" size="60">mdi-check</v-icon>
                <div class="cp-header-1 cp-semibold mb-4">
                  Reset Password Successfully
                </div>
                <div class="cp-text-description">
                  Your password has been successfully reset. Please use your new
                  password to log in.
                </div>
              </div>
            </v-tab-item>
          </v-tabs-items>
          <div v-if="tab !== 'tab-3'">
            <cp-divider text="or" />
            <div class="text-center">
              <a @click="$router.push('login')"> Back to sign in </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      tab: 'tab-1',
      onLoading: false,

      validUsername: true,
      username: '',
      usernameRules: [(v) => !!v || 'Required'],

      validResetCode: true,
      resetCode: '',
      resetCodeRules: [(v) => !!v || 'Required'],

      validNewPassword: true,
      password: '',
      passwordRules: [
        (v) => !!v || 'Required',
        (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
      ],
      showPassword: false,
      confirmPassword: '',
      confirmPasswordRules: [(v) => !!v || 'Required'],
      showConfirmPassword: false,
      confirmPasswordError: '',

      snackbarControl: {
        value: false,
        message: '',
      },
    }
  },
  watch: {
    confirmPassword(newValue, oldValue) {
      if (this.confirmPasswordError !== '') this.confirmPasswordError = ''
    },
  },
  methods: {
    validateUsername() {
      if (this.$refs.formUsername.validate()) {
        this.onCheckUsername()
      }
    },

    validateResetCode() {
      if (this.$refs.formResetCode.validate()) {
        this.onCheckResetCode()
      }
    },

    validateNewPassword() {
      if (this.$refs.formNewPassword.validate()) {
        this.onCheckNewPassword()
      }
    },

    async onCheckUsername() {
      this.onLoading = true

      await this.$axios
        .post(`${process.env.API_ENDPOINT}/v1/auth/password/required-reset`, {
          username: this.username,
        })
        .then(({ data }) => {
          if (data) {
            this.onLoading = false
            this.tab = 'tab-2'
          }
        })
        .catch((error) => {
          if (error) {
            this.snackbarControl.value = true
            this.snackbarControl.message = 'Username is incorrect!'
            this.onLoading = false
          }
        })
    },

    async onCheckResetCode() {
      this.onLoading = true

      await this.$axios
        .post(`${process.env.API_ENDPOINT}/v1/auth/password/verify-code`, {
          username: this.username,
          reset_code: this.resetCode,
        })
        .then(({ data }) => {
          if (data) {
            this.onLoading = false
            this.tab = 'tab-3'
          }
        })
        .catch((error) => {
          if (error) {
            this.snackbarControl.value = true
            this.snackbarControl.message = 'CODE is incorrect!'
            this.onLoading = false
          }
        })
    },

    async onCheckNewPassword() {
      this.onLoading = true

      if (this.password === this.confirmPassword) {
        await this.$axios
          .post(`${process.env.API_ENDPOINT}/v1/auth/password/reset`, {
            username: this.username,
            reset_code: this.resetCode,
            new_password: this.confirmPassword,
          })
          .then(({ data }) => {
            if (data) {
              this.onLoading = false
              this.tab = 'tab-4'
            }
          })
          .catch((error) => {
            if (error) {
              this.snackbarControl.value = true
              this.snackbarControl.message = 'Update Fail'
              this.onLoading = false
            }
          })
      } else {
        this.confirmPasswordError = 'Password confirmation does not match!'
        this.onLoading = false
      }
    },
  },
}
</script>

<style scoped>
.bg-forgot {
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fafafa;
}
.bg-forgot-container {
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
.bg-forgot-card {
  position: relative;
  z-index: 10;
  padding: var(--spacing-7);
  border-radius: var(--spacing-3);
  background-color: var(--base-light);
  box-shadow: var(--box-shadow-md);
}
</style>
