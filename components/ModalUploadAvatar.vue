<template>
  <div>
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
    <div v-else-if="infoLoading && avatarSelect" class="preview-avatar-loading">
      <v-img :src="avatarSelect" />
    </div>
    <div v-else>
      <div class="avatar-upload-loading">
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      avatarSelect: null,
    }
  },
  methods: {
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
    async runUploadAvatar() {
      const encodedString = btoa(this.avatarSelect)
      try {
        const { data } = await this.$axios.post(
          `${process.env.PORTAL_ENDPOINT}/v1/image/avatar/upload`,
          {
            image: encodedString,
          }
        )
        console.log(data)
        this.infoLoading = false
      } catch (error) {
        console.log(error.response)
        this.infoLoading = false
      }
    },
  },
}
</script>

<style scoped>
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
