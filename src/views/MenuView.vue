<template>
  <div class="container mt-4">
    <h2 class="mb-4">القائمة</h2>
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
  direction: rtl;
  text-align: right;
}

h2 {
  font-family: 'Cairo', sans-serif;
  color: #333;
  font-weight: 700;
}
</style>
