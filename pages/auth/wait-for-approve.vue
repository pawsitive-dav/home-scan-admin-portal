<template>
  <div class="bg-auth">
    <div class="bg-auth-container">
      <div class="graphic-box-1"></div>
      <div class="graphic-box-2"></div>
      <div class="graphic-box-3"></div>
      <div class="graphic-box-4"></div>

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
            Awaiting Approval
          </div>
          <div class="cp-text-description text-center">
            Your account is awaiting approval from the project owner. Please
            wait a little longer.
          </div>
        </div>
        <div class="bg-auth-card-footer pt-5">
          <div class="text-center">
            <span class="mr-2">Go back to</span>
            <a @click="$router.push('login')"> Sign in </a>
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
  layout: 'blankLayout',
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
