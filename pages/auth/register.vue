<template>
  <div class="bg-auth">
    <div class="bg-auth-container">
      <div class="graphic-box-1"></div>
      <div class="graphic-box-2"></div>
      <div class="graphic-box-3"></div>
      <div class="graphic-box-4"></div>
      <div class="bg-auth-card">
        <div class="bg-auth-card-body">
          <div class="text-center cp-title cp-medium">Sign Up</div>
          <div class="text-center cp-text-description mb-4 mt-2">
            Please fill in all the required information.
          </div>
          <v-tabs-items v-model="tab">
            <v-tab-item value="tab-1">
              <cp-divider text="Account" />
              <v-form ref="formLogin" v-model="valid" lazy-validation>
                <label for="username"> Username </label>
                <v-text-field
                  v-model="username"
                  :rules="usernameRules"
                  :disabled="onLoading"
                  :loading="usernameLoading"
                  :error-messages="usernameError"
                  name="username"
                  outlined
                  dense
                  required
                >
                  <template v-if="usernameIs !== ''" #append>
                    <v-icon v-if="usernameIs === 'Available'" color="success">
                      mdi-check-circle-outline
                    </v-icon>
                    <v-icon v-else color="error"
                      >mdi-close-circle-outline</v-icon
                    >
                  </template>
                </v-text-field>
                <label for="password">Password</label>
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
                <label for="password">Confirm Password</label>
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
            </v-tab-item>

            <v-tab-item value="tab-2">
              <cp-divider text="Information" />
              <v-form ref="formLogin" v-model="valid" lazy-validation>
                <label for="first-name"> First Name </label>
                <v-text-field
                  v-model="firstName"
                  name="first-name"
                  outlined
                  dense
                  required
                />
                <label for="last-name"> Last Name </label>
                <v-text-field
                  v-model="lastName"
                  name="last-name"
                  outlined
                  dense
                  required
                />
                <label for="last-name"> Code Name </label>
                <v-text-field
                  v-model="lastName"
                  name="last-name"
                  outlined
                  dense
                  required
                />
              </v-form>
            </v-tab-item>
          </v-tabs-items>

          <div class="mt-4">
            <v-btn
              v-if="tab === 'tab-1'"
              :disabled="!valid"
              :loading="onLoading"
              color="primary"
              elevation="0"
              height="42"
              block
              @click="validate()"
            >
              <div class="cp-text-capitalize">Next</div>
            </v-btn>
            <div v-else class="button-group">
              <v-btn elevation="0" height="42" @click="tab = 'tab-1'">
                <div class="cp-text-capitalize">Back</div>
              </v-btn>
              <v-btn color="primary" elevation="0" height="42">
                <div class="cp-text-capitalize">Sign Up</div>
              </v-btn>
            </div>
          </div>
        </div>

        <div v-if="tab === 'tab-1'" class="bg-auth-card-footer pt-5">
          <div class="text-center">
            <span class="mr-2">Already have an account?</span>
            <a v-if="!onLoading" @click="$router.push('login')">
              Sign in instead
            </a>
            <span
              v-else
              style="
                color: var(--base-primary);
                cursor: default;
                font-weight: 500;
              "
            >
              Sign in instead
            </span>
          </div>
          <cp-divider text="or" />
          <div class="cp-caption text-center cp-text-description">
            If you encounter issues, <br />
            please contact your project's owner.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'blankLayout',
  data() {
    return {
      tab: 'tab-1',
      onLoading: false,
      valid: true,
      username: '',
      usernameLoading: false,
      usernameIs: '',
      usernameError: '',
      usernameRules: [
        (v) => !!v || 'Required',
        (v) =>
          /^[a-z][a-z0-9]*$/.test(v) ||
          'Username can only start with a letter (a-z) and contain letters (a-z) and numbers (0-9)',
        (v) => (v && v.length >= 8) || 'Username must be at least 8 characters',
      ],
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
      firstName: '',
      lastName: '',
      codeName: '',
    }
  },
  watch: {
    username(newValue) {
      this.username = newValue.toLowerCase()
      this.usernameIs = ''
      this.usernameError = ''
      if (this.username.length > 7) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
          this.usernameLoading = false
        }
        this.timeoutId = setTimeout(() => {
          this.onVerifyUsername()
        }, 1000)
      }
    },
    confirmPassword(newValue) {
      if (this.confirmPasswordError !== '') {
        this.valid = true
        this.confirmPasswordError = ''
      }
    },
  },
  methods: {
    validate() {
      this.tab = 'tab-2'
      //   if (this.$refs.formLogin.validate()) {
      //     this.onLoading = true
      //     this.checkBeforeNext()
      //   }
    },
    async onVerifyUsername() {
      const isValidUsername = this.$refs.formLogin.inputs[0].valid
      if (isValidUsername) {
        this.usernameLoading = true
        try {
          const response = await this.$axios.post(
            '/api/v1/auth/verify/username',
            {
              username: this.username,
            }
          )
          if (response) this.usernameIs = 'Available'
        } catch (error) {
          const statusCode = error.response.data.statusCode
          if (statusCode === 409) {
            this.usernameIs = 'Unavailable'
            this.usernameError =
              'Username is already taken. Please choose another username.'
            this.valid = false
          }
        } finally {
          this.usernameLoading = false
        }
      }
    },
    async checkBeforeNext() {
      if (this.usernameIs === 'Available') {
        if (this.password !== this.confirmPassword) {
          this.confirmPasswordError = 'Password confirmation does not match!'
          this.onLoading = false
        } else {
          this.tab = 'tab-2'
          this.onLoading = false
        }
      } else if (this.usernameIs === 'Unavailable') {
        this.onLoading = false
      } else {
        await this.delay(600)
        await this.checkBeforeNext()
      }
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
  },
}
</script>

<style scoped>
.bg-auth {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: var(--deep-blue-opacity-1);
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
}
.bg-auth-card {
  position: relative;
  z-index: 10;
  padding: var(--spacing-7);
  border-radius: var(--spacing-3);
  background-color: var(--base-light);
  box-shadow: var(--box-shadow-md);
}
.button-group {
  display: flex;
  justify-content: space-between;
}
</style>
