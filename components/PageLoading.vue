<template>
  <div class="loading-body" :class="classList">
    <div class="spinner-box">
      <div class="circle-border">
        <div class="circle-core"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classList: [],
    }
  },
  created() {
    setTimeout(() => {
      this.checkToken()
    }, 1000)
  },
  methods: {
    checkToken() {
      const refreshToken = localStorage.getItem('_cp_scpoe')
      if (refreshToken) {
        const decodeToken = atob(refreshToken)
        console.log(decodeToken)
        this.$router.push('/')
        this.classList.push('stop-loading')
      } else {
        this.$router.push('/auth/login')
        this.classList.push('stop-loading')
      }
    },
  },
}
</script>

<style scoped>
.loading-body {
  position: fixed;
  z-index: 99;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fbfbfb;
  transition: all ease 0.3s;
}

@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(359deg);
  }
}

.spinner-box {
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.circle-border {
  width: 50px;
  height: 50px;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: rgb(32, 33, 33);
  background: linear-gradient(
    0deg,
    rgba(139, 139, 139, 0.1) 33%,
    rgb(34, 34, 34) 100%
  );
  animation: spin 0.8s linear 0s infinite;
}

.circle-core {
  width: 100%;
  height: 100%;
  background-color: #fbfbfb;
  border-radius: 50%;
}

.stop-loading {
  opacity: 0;
  z-index: 0;
}
</style>
