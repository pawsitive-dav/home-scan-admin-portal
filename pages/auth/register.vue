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
          <div class="text-center cp-text-description mb-2 mt-2">
            Please fill in all the required information.
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
            </v-tab-item>
            <v-tab-item value="tab-2">
              <cp-divider text="Information" />
              <div v-if="!infoLoading">
                <div v-if="!avatarSelect" class="avatar-upload">
                  <div @click="onUploadAvatar()"></div>
                </div>
                <div v-else class="preview-avatar" @click="onUploadAvatar()">
                  <v-img :src="avatarSelect" />
                  <div class="overlay">
                    <v-icon size="45" color="white" class="icon-cached">
                      mdi-cached
                    </v-icon>
                  </div>
                </div>
              </div>
              <div
                v-else-if="infoLoading && avatarSelect"
                class="preview-avatar-loading"
              >
                <v-img :src="avatarSelect" />
              </div>
              <div v-else>
                <div class="avatar-upload-loading">
                  <div></div>
                </div>
              </div>
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
                  :rules="validationEngThai"
                  :disabled="infoLoading"
                  counter="40"
                  maxlength="40"
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
      // Information
      validInfo: false,
      infoLoading: false,
      avatarSelect: null,
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
    onUploadAvatar() {
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/jpeg, image/jpg'
      fileInput.style.display = 'none'
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = () => {
            this.avatarSelect = reader.result
          }
          reader.readAsDataURL(file)
        }
      })
      document.body.appendChild(fileInput)
      fileInput.click()
      fileInput.addEventListener('change', () => {
        document.body.removeChild(fileInput)
      })
    },
    validateInfo() {
      if (this.$refs.formInformation.validate()) {
        console.log(this.avatarSelect)
        console.log(this.firstName)
        console.log(this.lastName)
        console.log(this.codeName)
        this.infoLoading = true
      }
    },
  },
}
</script>

<style scoped>
body {
  background-color: var(--deep-blue-opacity-1);
}
.bg-auth {
  position: relative;
  width: 100%;
  height: 100vh;
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
.avatar-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 150px;
}
.avatar-upload div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  cursor: pointer;
  border: 1px dashed var(--gray-600);
  background-color: var(--gray-opacity-1);
  background-image: url('~/assets/user.svg');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-size: 80px 80px;
  transition: all ease 0.1s;
}
.avatar-upload-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 150px;
}
.avatar-upload-loading div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: var(--gray-opacity-1);
  background-image: url('~/assets/user.svg');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-size: 80px 80px;
}
.avatar-upload div:hover {
  background-image: url('~/assets/upload.svg');
  background-size: 40px 40px;
}
.preview-avatar {
  position: relative;
  overflow: hidden;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  cursor: pointer;
  border: 1px dashed var(--gray-600);
  margin: auto;
}
.preview-avatar-loading {
  overflow: hidden;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  margin: auto;
}
.preview-avatar .overlay {
  position: absolute;
  top: 0;
  width: 150px;
  height: 150px;
  z-index: 10;
  transition: all ease 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}
.preview-avatar .overlay:hover {
  background-color: #ffffff4f;
}

.preview-avatar .icon-cached {
  opacity: 0;
}

.preview-avatar:hover .icon-cached {
  opacity: 0.7;
}
</style>
