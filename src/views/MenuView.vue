<template>
  <div class="container mt-4">
    <h2 class="mb-4">Menu</h2>
    <MenuList :ownerId="$route.params.id" />
  </div>
</template>

<script>
import MenuList from '@/components/Menu/MenuList.vue'

export default {
  components: {
    MenuList
  }
}
</script>

<style scoped>

.container {
  padding-top: 50px;
}
</style>
