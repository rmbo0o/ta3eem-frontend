<template>
  <div class="not-found text-center py-5">
    <h1>404</h1>
    <p class="lead">Page Not Found</p>
    <router-link to="/" class="btn btn-primary">Go Home</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
