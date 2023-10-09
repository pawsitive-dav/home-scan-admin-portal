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
        <div class="bg-auth-card-body">
          <div v-if="tab !== 'tab-3'">
            <div class="text-center cp-title cp-medium">Sign Up</div>
            <div class="text-center cp-text-description mb-2 mt-2">
              Please fill in all the required information.
            </div>
          </div>
          <v-tabs-items v-model="tab">
            <v-tab-item value="tab-1">
              <cp-divider text="Account" />
              <v-form ref="formLogin" v-model="valid" lazy-validation>
                <cp-label for="username"> Username </cp-label>
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
                    <v-icon v-else color="error">
                      mdi-close-circle-outline
                    </v-icon>
                  </template>
                </v-text-field>
                <cp-label>Password</cp-label>
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
                <cp-label>Confirm Password</cp-label>
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
              <v-form ref="formInformation" v-model="validInfo" lazy-validation>
                <cp-label for="first-name"> First Name </cp-label>
                <v-text-field
                  v-model="firstName"
                  name="first-name"
                  :rules="validationEngThai"
                  :disabled="infoLoading"
                  counter="60"
                  maxlength="60"
                  outlined
                  dense
                  required
                />
                <cp-label for="last-name"> Last Name </cp-label>
                <v-text-field
                  v-model="lastName"
                  name="last-name"
                  :rules="validationEngThai"
                  :disabled="infoLoading"
                  counter="60"
                  maxlength="60"
                  outlined
                  dense
                  required
                />
                <cp-label for="last-name">
                  Code Name
                  <v-tooltip top max-width="260">
                    <template #activator="{ on, attrs }">
                      <v-icon v-bind="attrs" size="18" v-on="on">
                        mdi-information-slab-circle-outline
                      </v-icon>
                    </template>
                    <span>
                      <b>"Code Name"</b> is the name used for reference in your
                      team. You can use your nickname as your Code Name. Please
                      enter it in English only.
                    </span>
                  </v-tooltip>
                </cp-label>
                <v-text-field
                  v-model="codeName"
                  name="last-name"
                  :rules="validationEngOnly"
                  :disabled="infoLoading"
                  counter="40"
                  maxlength="40"
                  outlined
                  dense
                  required
                />
              </v-form>
            </v-tab-item>
            <v-tab-item value="tab-3" class="text-center">
              <v-icon color="success" size="60">mdi-check</v-icon>
              <div class="cp-header-1 cp-semibold mb-4">
                Regsiter Successfully
              </div>
              <div class="cp-text-description">
                Your account is awaiting approval from the project owner. Please
                wait a little longer.
              </div>
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
            <div v-else-if="tab === 'tab-2'" class="button-group">
              <v-btn
                :disabled="infoLoading"
                elevation="0"
                height="42"
                @click="tab = 'tab-1'"
              >
                <div class="cp-text-capitalize">Back</div>
              </v-btn>
              <v-btn
                :loading="infoLoading"
                color="primary"
                elevation="0"
                height="42"
                @click="validateInfo()"
              >
                <div class="cp-text-capitalize">Sign Up</div>
              </v-btn>
            </div>
          </div>
        </div>

        <div v-if="tab !== 'tab-2'" class="bg-auth-card-footer pt-5">
          <div class="text-center">
            <span v-if="tab !== 'tab-3'" class="mr-2">
              Already have an account?
            </span>
            <a v-if="!onLoading" @click="$router.push('login')">
              <span v-if="tab !== 'tab-3'">Sign in instead</span>
              <span v-else>Back to sign in</span>
            </a>
            <span v-else class="alternate-signin-text"> Sign in instead </span>
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
      // Information
      validInfo: false,
      infoLoading: false,
      firstName: '',
      lastName: '',
      codeName: '',
      validationEngThai: [
        (v) => !!v || 'Required',
        (v) =>
          (!(/[a-zA-Z]/.test(v) && /[ก-ฮ]/.test(v)) &&
            /^(?!.*[๐๑๒๓๔๕๖๗๘๙฿ๆฯ])[a-zA-Z\u0E01-\u0E5B]+$/.test(v)) ||
          'Only English and Thai letters are allowed',
      ],
      validationEngOnly: [
        (v) => !!v || 'Required',
        (v) => /^[a-zA-Z]+$/.test(v) || 'Please enter English letters only',
      ],
      // Snackbar
      snackbarControl: {
        value: false,
        message: '',
      },
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
      if (this.$refs.formLogin.validate()) {
        this.onLoading = true
        this.checkBeforeNext()
      }
    },
    async onVerifyUsername() {
      const isValidUsername = this.$refs.formLogin.inputs[0].valid
      if (isValidUsername) {
        this.usernameLoading = true

        await this.$axios
          .post(`${process.env.API_ENDPOINT}/v1/auth/verify/username`, {
            username: this.username,
          })
          .then((response) => {
            if (response.data) {
              this.usernameIs = 'Available'
            }
          })
          .catch((error) => {
            const statusCode = error.response
              ? error.response.data.statusCode
              : null
            if (statusCode === 409) {
              this.usernameIs = 'Unavailable'
              this.usernameError =
                'Username is already taken. Please choose another username.'
              this.valid = false
            } else {
              this.usernameIs = 'Unavailable'
              this.usernameError = 'Something went wrong please try again.'
              this.valid = false
            }
          })
          .finally(() => {
            this.usernameLoading = false
          })
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

    validateInfo() {
      if (this.$refs.formInformation.validate()) {
        this.infoLoading = true
        this.onSignUp()
      }
    },
    async onSignUp() {
      await this.$axios
        .post(`${process.env.API_ENDPOINT}/v1/auth/register/portal`, {
          username: this.username,
          password: this.password,
          first_name: this.firstName,
          last_name: this.lastName,
          code_name: this.codeName,
        })
        .then(({ data }) => {
          if (data) {
            this.tab = 'tab-3'
          }
        })
        .catch((error) => {
          if (error) {
            this.snackbarControl.value = true
            this.snackbarControl.message =
              'Something went wrong, please try again!'
            this.infoLoading = false
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
