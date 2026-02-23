<template>
  <div id="app" dir="rtl">
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
/* Basic reset with Arabic font */
body, html {
  margin: 0;
  padding: 0;
  font-family: 'Cairo', 'Tajawal', sans-serif;
  text-align: right;
  direction: rtl;
}

/* RTL Helper Classes */
.ms-auto {
  margin-right: auto !important;
  margin-left: 0 !important;
}

.me-auto {
  margin-left: auto !important;
  margin-right: 0 !important;
}

/* Fix Bootstrap grid for RTL */
.row {
  flex-direction: row-reverse;
}

/* Fix input groups */
.input-group > .form-control:not(:last-child) {
  border-radius: 0 0.25rem 0.25rem 0;
}

.input-group > .input-group-append > .btn {
  border-radius: 0.25rem 0 0 0.25rem;
}

/* Fix icons in buttons */
.btn i {
  margin-left: 0.5rem;
  margin-right: 0;
}
</style>
