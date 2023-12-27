<template>
  <div class="cp-link" @click="handleClick">
    <slot></slot>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      this.$emit('click')
    },
  },
}
</script>

<style scoped>
.cp-link {
  cursor: pointer;
  transition: all ease 0.3s;
}
.cp-link:hover {
  color: var(--deep-blue-400);
  text-decoration: underline;
}
</style>
