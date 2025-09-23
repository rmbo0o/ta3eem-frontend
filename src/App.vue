<template>
  <div id="app">
    <Navbar />
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
/* Basic reset */
body, html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
</style>
