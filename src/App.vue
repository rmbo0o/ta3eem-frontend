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
body, html {
  margin: 0;
  padding: 0;
  direction: rtl;
  text-align: right;
  font-family: 'Noto Sans Arabic', sans-serif;
}

/* All elements will inherit the font */
h1, h2, h3, h4, h5, h6, p, a, span, div, button, input, textarea, select, label, small {
  font-family: 'Noto Sans Arabic', sans-serif;
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

/* Fix input groups for RTL */
.input-group > .form-control:not(:last-child) {
  border-radius: 0 0.25rem 0.25rem 0;
}

.input-group > .input-group-append > .btn {
  border-radius: 0.25rem 0 0 0.25rem;
}

/* Fix icons in buttons for RTL */
.btn i {
  margin-left: 0.5rem;
  margin-right: 0;
}

/* Optional: Different font weights for headings */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700; /* Bold for headings */
}

/* Optional: Lighter weight for body text */
p, span, div, label {
  font-weight: 400; /* Regular for body text */
}

/* Optional: Medium weight for buttons */
button, .btn {
  font-weight: 500; /* Medium for buttons */
}
</style>
