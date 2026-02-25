<template>
  <div id="app" dir="rtl">
    <Navbar />
    <router-view></router-view>
    <InstallPrompt />
    <IOSInstallPrompt />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import InstallPrompt from './components/InstallPrompt.vue'
import IOSInstallPrompt from './components/IOSInstallPrompt.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    InstallPrompt,
    IOSInstallPrompt
  }
}
</script>

<style>
/* Import Noto Sans Arabic Font */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@100..900&display=swap');

/* Reset ALL fonts - but exclude ALL icon classes */
*:not(i):not([class^="fa-"]):not([class*=" fa-"]) {
  font-family: 'Noto Sans Arabic', sans-serif !important;
}

/* Base icon styles - for ALL font awesome icons */
i,
[class^="fa-"],
[class*=" fa-"],
.fa,
.fas,
.far,
.fal,
.fad,
.fat,
.fab {
  font-family: inherit !important;
}

/* Brand icons (Facebook, Instagram, Twitter, etc) */
.fab {
  font-family: "Font Awesome 6 Brands" !important;
  font-weight: 400 !important;
}

/* Solid icons (map, phone, envelope, etc) */
.fas {
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 900 !important;
}

/* Regular icons */
.far {
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 400 !important;
}

/* Optional: Light icons (if you use them) */
.fal {
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 300 !important;
}

/* Make sure icons have the correct display */
i {
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
}

/* Your existing RTL styles */
body, html {
  margin: 0;
  padding: 0;
  direction: rtl;
  text-align: right;
}

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
