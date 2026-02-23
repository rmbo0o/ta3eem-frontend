<template>
  <nav :class="['navbar', 'navbar-expand-lg', 'px-4', { 'navbar-solid': isSolid }]">
    <div class="navbar-brand-container">
      <img src="@/assets/ta3eem-logo.png" alt="شعار طعم" class="navbar-logo">
      <router-link to="/" class="navbar-brand">Ta3eem</router-link>
    </div>
    <div v-if="!isLoggedIn" class="d-flex gap-2">
      <router-link to="/login" class="btn btn-outline-light">تسجيل الدخول</router-link>
      <router-link to="/register" class="btn btn-light">إنشاء حساب</router-link>
    </div>
    <div v-else>
      <button @click="handleLogout" class="btn btn-outline-light-danger">تسجيل الخروج</button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { computed, ref, onMounted, onUnmounted } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const isSolid = ref(false)

const isLoggedIn = computed(() => auth.isAuthenticated)

const handleScroll = () => {
  const scrollPosition = window.scrollY || window.pageYOffset
  isSolid.value = scrollPosition > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  background-color: transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 20px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  direction: rtl;
}

.navbar-brand-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.navbar-logo {
  height: 40px;
  width: auto;
  transition: all 0.4s ease;
}

.navbar-solid {
  background-color: white !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px 5%;
}

.navbar-brand {
  color: #3b3a39;
  font-weight: bold;
  transition: color 0.4s ease;
  font-family: 'Cairo', sans-serif;
  font-size: 1.5rem;
}

.navbar-solid .navbar-brand {
  color: #2d333f !important;
}

.btn-outline-light {
  background-color: white;
  color: #2d333f;
  transition: all 0.4s ease;
  font-family: 'Cairo', sans-serif;
}

.btn-outline-light:hover {
  border: 1px solid #FFC107;
  background-color: rgba(255, 255, 255, 0.9);
  color: #2d333f;
}

.btn-light {
  background-color: white;
  color: #2d333f;
  transition: all 0.4s ease;
  font-family: 'Cairo', sans-serif;
}

.btn-light:hover {
  border: 1px solid #FFC107;
  background-color: rgba(255, 255, 255, 0.9);
  color: #2d333f;
}

.btn-outline-light-danger {
  background-color: white;
  color: #2d333f;
  transition: all 0.4s ease;
  font-family: 'Cairo', sans-serif;
}

.btn-outline-light-danger:hover {
  border: 1px solid #FFC107;
  background-color: red;
  color: white;
}

.navbar-solid .btn-outline-light {
  background-color: #FFC107;
  color: white;
}

.navbar-solid .btn-outline-light:hover {
  background-color: #434a59;
}

.navbar-solid .btn-light {
  background-color: #2d333f;
  color: white;
}

.navbar-solid .btn-light:hover {
  background-color: #434a59;
}

@media (max-width: 768px) {
  .navbar-logo {
    height: 30px;
  }

  .navbar-brand {
    font-size: 1.2rem;
  }

  .navbar {
    padding: 15px 3%;
  }
}
</style>
