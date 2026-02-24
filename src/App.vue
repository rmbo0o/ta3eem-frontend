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
    Navbar,

  }
}
</script>

<style>
/* Import Noto Sans Arabic Font */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@100..900&display=swap');

/* Global RTL and Font Settings */
* {
  font-family: 'Noto Sans Arabic', sans-serif !important;
}

/* BUT - Exclude Font Awesome icons! */
i[class^="fa-"],
i[class*=" fa-"],
.fab, .fas, .far, .fal, .fad, .fat {
  font-family: "Font Awesome 6 Free" !important;
}

.fab {
  font-family: "Font Awesome 6 Brands" !important;
}

.fas, .far, .fal, .fad, .fat {
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 900;
}

.far {
  font-weight: 400;
}

body, html {
  margin: 0;
  padding: 0;
  direction: rtl;
  text-align: right;
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

.row {
  flex-direction: row-reverse;
}

.input-group > .form-control:not(:last-child) {
  border-radius: 0 0.25rem 0.25rem 0;
}

.input-group > .input-group-append > .btn {
  border-radius: 0.25rem 0 0 0.25rem;
}

.btn i {
  margin-left: 0.5rem;
  margin-right: 0;
}
</style>
