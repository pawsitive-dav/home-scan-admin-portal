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
      this.classList.push('stop-loading')
    }, 2000)
  },
  methods: {
    checkToken() {
      //
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
  width: 80px;
  height: 80px;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: rgb(63, 249, 220);
  background: linear-gradient(
    0deg,
    rgba(63, 249, 220, 0.1) 33%,
    rgb(41, 218, 191) 100%
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
