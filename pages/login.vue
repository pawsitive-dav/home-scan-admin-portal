<template>
  <div class="login-bg">
    <v-card>
      <v-card-text>
        <v-text-field id="id" name="name" label="label"></v-text-field>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    login() {
      // Add your login logic here
      console.log('Login button clicked')
      console.log('Email:', this.email)
      console.log('Password:', this.password)
    },
  },
}
</script>

<style scoped>
.bg-login {
  position: fixed;
  z-index: 99;
  width: 100%;
  height: 100vh;
  background-color: #f8f7fa;
}
</style>
