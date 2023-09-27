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
            <label for="username">Username</label>
            <v-text-field
              v-model="username"
              :rules="usernameRules"
              :disabled="onLoading"
              name="username"
              outlined
              dense
              required
            />
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
            If you forgot your password, <br />
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
      onLoading: false,
      valid: true,
      username: '',
      usernameRules: [(v) => !!v || 'Required'],
      password: '',
      passwordRules: [(v) => !!v || 'Required'],
      showPassword: false,
      snackbarControl: {
        value: false,
        message: 'Username or Password is incorrect!',
      },
    }
  },
  methods: {
    validate() {
      if (this.$refs.formLogin.validate()) {
        this.onLogin()
      }
    },
    onLogin() {
      this.onLoading = true

      // Test Error
      setTimeout(() => {
        this.snackbarControl.value = true
        this.onLoading = false
      }, 1000)
      setTimeout(() => {
        this.snackbarControl.value = false
      }, 3000)

      // Test Wait for approve
      // setTimeout(() => {
      //   this.$router.push('wait-for-approve')
      // }, 1000)
    },
  },
}
</script>

<style scoped>
.bg-auth {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
