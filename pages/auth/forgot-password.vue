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
              <div class="text-center cp-title cp-medium">คุณลืมรหัสผ่าน?</div>
              <cp-divider text="กรุณากรอกบัญชีผู้ใช้เพื่อไปขั้นตอนถัดไป" />
              <v-form
                ref="formUsername"
                v-model="validUsername"
                lazy-validation
              >
                <cp-label>บัญชีผู้ใช้</cp-label>
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
                  height="36"
                  block
                  @click="validateUsername()"
                >
                  <div class="cp-text-capitalize">ต่อไป</div>
                </v-btn>
              </div>
            </v-tab-item>
            <v-tab-item value="tab-2">
              <div class="text-center cp-title cp-medium">Reset CODE</div>
              <cp-divider text="กรอก Reset CODE เพื่อไปขั้นตอนถัดไป" />
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
                  height="36"
                  block
                  @click="validateResetCode()"
                >
                  <div class="cp-text-capitalize">ต่อไป</div>
                </v-btn>
              </div>
            </v-tab-item>
            <v-tab-item value="tab-3">
              <div class="text-center cp-title cp-medium">
                สร้างรหัสผ่านใหม่
              </div>
              <cp-divider text="กรุณากรอก รหัสผ่านใหม่" />
              <cp-label for="password">รหัสผ่าน</cp-label>
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
                <cp-label for="password">ยืนยันรหัสผ่าน</cp-label>
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
                  height="36"
                  block
                  @click="validateNewPassword()"
                >
                  <div class="cp-text-capitalize">ยืนยัน</div>
                </v-btn>
              </div>
            </v-tab-item>
            <v-tab-item value="tab-4">
              <div class="text-center">
                <v-icon color="success" size="60">mdi-check</v-icon>
                <div class="cp-header-1 cp-semibold mb-4">
                  เปลี่ยนรหัสผ่านใหม่สำเร็จ
                </div>
                <div class="cp-text-description">
                  ระบบได้เปลี่ยนรหัสผ่านของคุณเป็นรหัสผ่านใหม่แล้ว
                </div>
              </div>
            </v-tab-item>
          </v-tabs-items>
          <div v-if="tab === 'tab-1' || tab === 'tab-2'">
            <cp-divider text="หรือ" />
            <div class="text-center">
              <a @click="$router.push('login')"> กลับหน้าเข้าสู่ระบบ </a>
            </div>
          </div>
          <div v-if="tab === 'tab-4'">
            <cp-divider text="กรุณาใช้รหัสผ่านใหม่เพื่อเข้าสู่ระบบ" />
            <div class="text-center">
              <a @click="$router.push('login')"> เข้าสู่ระบบ </a>
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
      usernameRules: [(v) => !!v || 'ข้อมูลจำเป็น'],

      validResetCode: true,
      resetCode: '',
      resetCodeRules: [(v) => !!v || 'ข้อมูลจำเป็น'],

      validNewPassword: true,
      password: '',
      passwordRules: [
        (v) => !!v || 'ข้อมูลจำเป็น',
        (v) => (v && v.length >= 8) || 'กรอกรหัสผ่าน 8 หลักขึ้นไป',
      ],
      showPassword: false,
      confirmPassword: '',
      confirmPasswordRules: [(v) => !!v || 'ข้อมูลจำเป็น'],
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
            this.snackbarControl.message = 'บัญชีผู้ใช้ไม่ถูกต้อง!'
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
            this.snackbarControl.message = 'CODE ไม่ถูกต้อง!'
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
              this.snackbarControl.message = 'System Update Fail'
              this.onLoading = false
            }
          })
      } else {
        this.confirmPasswordError = 'คุณยืนยันรหัสผ่านไม่ถูกต้อง!'
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
