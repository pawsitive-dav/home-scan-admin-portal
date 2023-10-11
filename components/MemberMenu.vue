<template>
  <div>
    <v-menu
      min-width="220px"
      max-width="300px"
      nudge-top="-12"
      content-class="layout-menu"
      bottom
      offset-y
      left
    >
      <template #activator="{ on }">
        <v-btn icon height="40" width="40" v-on="on">
          <v-avatar color="primary" size="40">
            <span v-if="!internalAvatarPath" class="white--text cp-subtitle">{{
              codeName ? codeName[0] : ''
            }}</span>
            <v-img v-else :src="internalAvatarPath" />
          </v-avatar>
        </v-btn>
      </template>
      <cp-card>
        <div class="layout-menu-header">
          <v-avatar color="primary" size="40">
            <span
              v-if="!internalAvatarPath"
              class="white--text cp-subtitle"
              style="text-transform: uppercase"
            >
              {{ codeName ? codeName[0] : '' }}
            </span>
            <v-img v-else :src="internalAvatarPath" />
          </v-avatar>
          <div>
            <div style="text-transform: capitalize; font-weight: 500">
              <span class="mr-1">{{ firstName ? firstName : 'Null' }}</span>
              <span>{{ lastName ? lastName : 'Null' }}</span>
            </div>
            <div
              class="cp-caption cp-text-description"
              style="text-transform: capitalize"
            >
              {{ role ? role : '-' }}
            </div>
          </div>
        </div>
        <v-divider />
        <ul>
          <li @click="dialogSetting = true">
            <v-icon class="li-icon">mdi-tune-vertical-variant</v-icon>
            <span>Settings</span>
          </li>
        </ul>
        <v-divider />
        <ul>
          <li @click="dialogLogout = true">
            <v-icon class="li-icon">mdi-logout</v-icon>
            <span>Log Out</span>
          </li>
        </ul>
      </cp-card>
    </v-menu>

    <!-- Modal Log Out -->
    <v-dialog
      v-model="dialogLogout"
      max-width="300px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          Log Out
          <v-spacer />
          <v-btn icon class="mt-n4 mr-n4" @click="dialogLogout = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div>Are you sure you want to log out?</div>
          <div class="mt-4">
            <v-btn elevation="0" height="42" color="primary" block>
              <div class="cp-text-capitalize" @click="onLogOut()">Log Out</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal Setting -->
    <v-dialog
      v-model="dialogSetting"
      :persistent="modalLoading"
      max-width="600px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          Account Setting
          <v-spacer />
          <v-btn
            :disabled="modalLoading"
            icon
            class="mt-n4 mr-n4"
            @click="dialogSetting = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
          <v-row>
            <v-col cols="5">
              <div class="text-center">
                <div>
                  <v-avatar v-if="!avatarSelect" size="150" color="primary">
                    <div
                      v-if="!internalAvatarPath"
                      style="
                        font-size: 5rem;
                        text-transform: uppercase;
                        font-weight: 700;
                        color: #ffffff;
                      "
                    >
                      {{ codeName ? codeName[0] : 'U' }}
                    </div>
                    <v-img v-else :src="internalAvatarPath" />
                  </v-avatar>
                  <v-avatar v-else size="150" color="primary">
                    <v-img :src="avatarSelect" />
                  </v-avatar>
                </div>
                <v-btn
                  v-if="!avatarSelect"
                  elevation="0"
                  class="mt-4"
                  small
                  @click="onUploadAvatar(), (imgErrorMessage = '')"
                >
                  <div class="cp-text-capitalize">Edit</div>
                </v-btn>
                <div v-else>
                  <v-btn
                    :disabled="modalLoading"
                    elevation="0"
                    class="mt-4"
                    small
                    @click="avatarSelect = ''"
                  >
                    <div class="cp-text-capitalize">cancel</div>
                  </v-btn>
                  <v-btn
                    :disabled="modalLoading"
                    elevation="0"
                    class="mt-4"
                    outlined
                    small
                    @click="onUploadAvatar(), (imgErrorMessage = '')"
                  >
                    <div class="cp-text-capitalize">Change</div>
                  </v-btn>
                  <div>
                    <v-btn
                      :loading="modalLoading"
                      color="primary"
                      elevation="0"
                      class="mt-4"
                      small
                      @click="uploadAvatar()"
                    >
                      <div class="cp-text-capitalize">Save</div>
                    </v-btn>
                  </div>
                </div>
                <div v-if="imgErrorMessage" class="cp-caption error--text pt-4">
                  {{ imgErrorMessage }}
                </div>
              </div>
            </v-col>
            <v-col cols="7">
              <div class="pb-6">
                <div class="label-content">Name</div>
                <div class="py-2">
                  <span class="mr-1">{{ firstName ? firstName : 'Null' }}</span>
                  <span>{{ lastName ? lastName : 'Null' }}</span>
                </div>
              </div>
              <div class="pb-6">
                <div class="label-content">Code Name</div>
                <div class="py-2">
                  {{ codeName ? codeName : 'Null' }}
                </div>
              </div>
              <div class="pb-6">
                <div class="label-content">Role</div>
                <div class="py-2" style="text-transform: capitalize">
                  {{ role ? role : 'Null' }}
                </div>
              </div>
              <div class="pb-6">
                <div class="label-content mb-2">Password</div>
                <a
                  @click="
                    ;(dialogResetPassword = true), (dialogSetting = false)
                  "
                >
                  Change password
                </a>
              </div>
              <v-divider />
              <div class="pt-6 pb-4">
                <div class="label-content mb-2">Account</div>
                <a
                  class="error--text"
                  @click="
                    ;(dialogDeleteAccount = true), (dialogSetting = false)
                  "
                >
                  Delete account
                </a>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal Reset Password -->
    <v-dialog
      v-model="dialogResetPassword"
      :persistent="modalLoading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          Reset Password
          <v-spacer />
          <v-btn
            :disabled="modalLoading"
            icon
            class="mt-n4 mr-n4"
            @click="dialogResetPassword = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
          <v-form
            ref="formResetPassword"
            v-model="validResetPassword"
            lazy-validation
          >
            <cp-label>New Password</cp-label>
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              :disabled="modalLoading"
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
            <cp-label>Confirm New Password</cp-label>
            <v-text-field
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
              :disabled="modalLoading"
              :append-icon="
                showConfirmPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
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

          <div class="mt-4 d-flex flex-row-reverse">
            <v-btn
              :loading="modalLoading"
              :disabled="!validResetPassword"
              elevation="0"
              height="42"
              color="primary"
              @click="validateResetPassword()"
            >
              <div class="cp-text-capitalize">Reset</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal Delete Account -->
    <v-dialog
      v-model="dialogDeleteAccount"
      :persistent="modalLoading"
      max-width="400px"
      transition="dialog-transition"
      content-class="elevation-0"
      scrollable
    >
      <v-card>
        <v-card-title>
          Delete Account
          <v-spacer />
          <v-btn
            :disabled="modalLoading"
            icon
            class="mt-n4 mr-n4"
            @click="dialogDeleteAccount = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="pb-4">
            To proceed with the account deletion, please enter your Code Name to
            confirm.

            <v-card outlined class="mt-4">
              <v-card-text>
                <div class="cp-title cp-semibold">
                  {{ codeName }}
                </div>
              </v-card-text>
            </v-card>
          </div>
          <v-form
            ref="formDeleteAccount"
            v-model="validDeleteAccount"
            lazy-validation
          >
            <cp-label>Code Name</cp-label>
            <v-text-field
              v-model="confirmDelete"
              :rules="confirmDeleteRules"
              :disabled="modalLoading"
              outlined
              dense
              required
            />
          </v-form>

          <div class="mt-4 d-flex flex-row-reverse">
            <v-btn
              :loading="modalLoading"
              :disabled="!validDeleteAccount"
              elevation="0"
              height="42"
              color="error"
              @click="validateDeleteAccount()"
            >
              <div class="cp-text-capitalize">Confirm Delete</div>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      dialogLogout: false,
      dialogSetting: false,
      dialogResetPassword: false,
      internalAvatarPath: null,
      // Account Setting
      avatarSelect: null,
      imgErrorMessage: '',
      modalLoading: false,
      // Change Password
      validResetPassword: true,
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
      //   Delete Account
      dialogDeleteAccount: false,
      validDeleteAccount: true,
      deleteConfirm: false,
      confirmDelete: '',
      confirmDeleteRules: [
        (v) => !!v || 'Required',
        (v) => v === `${this.codeName}` || 'Code Name does not match',
      ],
    }
  },
  computed: {
    ...mapState('user', [
      'accountId',
      'avatarPath',
      'firstName',
      'lastName',
      'codeName',
      'role',
      'appRoleList',
    ]),
  },
  watch: {
    avatarPath(newValue) {
      if (newValue) {
        this.internalAvatarPath = newValue
      } else {
        this.internalAvatarPath = null
      }
    },
    imgErrorMessage(newValue) {
      if (newValue !== '') {
        setTimeout(() => {
          this.imgErrorMessage = ''
        }, 2500)
      }
    },
    dialogSetting(newValue) {
      if (!newValue) {
        this.avatarSelect = ''
      }
    },
    dialogResetPassword(newValue) {
      if (!newValue) {
        this.dialogSetting = true
        this.$refs.formResetPassword.reset()
      }
    },
    confirmPassword(newValue) {
      if (this.confirmPasswordError !== '') {
        this.validResetPassword = true
        this.confirmPasswordError = ''
      }
    },
    dialogDeleteAccount(newValue) {
      if (!newValue && !this.deleteConfirm) {
        this.dialogSetting = true
        this.$refs.formDeleteAccount.reset()
      }
    },
  },
  methods: {
    ...mapActions('user', ['getAccessToken', 'setLogout']),
    ...mapActions('notify', ['onNotify']),
    onLogOut() {
      localStorage.removeItem('_cp_scope')
      this.setLogout()
      this.dialogLogout = false
      this.$router.push('/auth/login')
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
            const image = new Image()
            image.src = reader.result
            image.onload = () => {
              if (image.width === image.height && image.width <= 500) {
                this.avatarSelect = reader.result
              } else {
                this.imgErrorMessage =
                  'The image must have a 1:1 aspect ratio and be no larger than 500x500 pixels.'
              }
            }
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
    async uploadAvatar() {
      this.modalLoading = true
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/avatar/upload`,
            {
              image: this.avatarSelect,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          )
          .then((response) => {
            const data = response.data
            if (data) {
              this.internalAvatarPath = this.avatarSelect
              this.modalLoading = false
              this.avatarSelect = ''
              this.onNotify({
                notifyValue: true,
                type: 'success',
                title: 'Success',
                message: 'Change avatar successfully.',
              })
            }
          })
          .catch((error) => {
            if (error) this.modalLoading = false
          })
      } else {
        this.modalLoading = false
        alert('API authentication failed')
      }
    },

    validateResetPassword() {
      if (this.$refs.formResetPassword.validate()) {
        if (this.password !== this.confirmPassword) {
          this.confirmPasswordError = 'Password confirmation does not match!'
        } else {
          this.onResetPassword()
        }
      }
    },
    async onResetPassword() {
      this.modalLoading = true
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        await this.$axios
          .post(
            `${process.env.API_ENDPOINT}/v1/member/update-password`,
            {
              new_password: this.confirmPassword,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          )
          .then(({ data }) => {
            if (data) {
              this.dialogResetPassword = false
              this.modalLoading = false
              this.onNotify({
                notifyValue: true,
                type: 'success',
                title: 'Success',
                message: 'Change password successfully.',
              })
            }
          })
          .catch((error) => {
            if (error) this.modalLoading = false
          })
      } else {
        this.modalLoading = false
        alert('API authentication failed')
      }
    },
    validateDeleteAccount() {
      if (this.$refs.formDeleteAccount.validate()) {
        this.onDeleteAccount()
      }
    },
    async onDeleteAccount() {
      this.modalLoading = true
      const accessToken = await this.getAccessToken()
      if (accessToken) {
        await this.$axios
          .post(`${process.env.API_ENDPOINT}/v1/auth/account/delete`, null, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })
          .then(({ data }) => {
            if (data) {
              this.deleteConfirm = true
              this.dialogDeleteAccount = false
              localStorage.removeItem('_cp_scope')
              this.setLogout()
              this.$router.push('/auth/login')
            }
          })
          .catch((error) => {
            if (error) {
              this.modalLoading = false
              this.onNotify({
                notifyValue: true,
                type: 'error',
                title: 'Error',
                message: 'Delete Account Fail',
              })
            }
          })
      } else {
        this.modalLoading = false
        alert('API authentication failed')
      }
    },
  },
}
</script>

<style scoped>
.layout-menu {
  box-shadow: var(--box-shadow-md);
}
.layout-menu-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;
}
ul {
  list-style: none;
  padding: 8px;
}
li {
  display: flex;
  align-items: center;
  color: var(--gray-800);
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 2px;
  cursor: pointer;
}
li:hover {
  background-color: var(--deep-blue-opacity-2);
  color: var(--base-primary);
}
li > .li-icon {
  margin-right: 12px;
}
li:hover > .li-icon {
  color: var(--base-primary);
}
</style>
