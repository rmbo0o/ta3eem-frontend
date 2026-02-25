<template>
  <nav :class="['navbar', 'navbar-expand-lg', { 'navbar-solid': isSolid }]">
    <div class="navbar-brand-container">
      <img src="@/assets/ta3eem-logo.png" alt="شعار طعم" class="navbar-logo">
      <router-link to="/" class="navbar-brand">طعيم</router-link>
    </div>

    <!-- Mobile menu button -->
    <button class="mobile-menu-btn" @click="toggleMobileMenu" v-if="!isLoggedIn && !isDashboard">
      <i class="fas fa-bars"></i>
    </button>

    <!-- Desktop menu - hide on dashboard -->
    <div class="desktop-menu" v-if="!isLoggedIn && !isDashboard">
      <router-link to="/login" class="btn btn-outline-light">تسجيل الدخول</router-link>
      <router-link to="/register" class="btn btn-light">إنشاء حساب</router-link>
    </div>

    <!-- Logout button - only show on non-dashboard pages -->
    <div v-if="isLoggedIn && !isDashboard">
      <button @click="handleLogout" class="btn btn-outline-light-danger">تسجيل الخروج</button>
    </div>

    <!-- Mobile menu dropdown -->
    <div class="mobile-menu" v-if="mobileMenuOpen && !isLoggedIn && !isDashboard">
      <router-link to="/login" class="mobile-menu-item" @click="mobileMenuOpen = false">
        <i class="fas fa-sign-in-alt"></i> تسجيل الدخول
      </router-link>
      <router-link to="/register" class="mobile-menu-item" @click="mobileMenuOpen = false">
        <i class="fas fa-user-plus"></i> إنشاء حساب
      </router-link>
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
const mobileMenuOpen = ref(false)

const isLoggedIn = computed(() => auth.isAuthenticated)

// Check if current route is dashboard
const isDashboard = computed(() => {
  const path = router.currentRoute.value.path
  return path.startsWith('/dashboard')
})

const handleScroll = () => {
  const scrollPosition = window.scrollY || window.pageYOffset
  isSolid.value = scrollPosition > 20
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
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
  padding: 15px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  direction: rtl;
  flex-wrap: wrap;
}

.navbar-solid {
  background-color: white !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px 5%;
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

.navbar-brand {
  color: #3b3a39;
  font-weight: 700;
  transition: color 0.4s ease;
  font-family: 'Noto Sans Arabic', sans-serif;
  font-size: 1.5rem;
  text-decoration: none;
}

.navbar-solid .navbar-brand {
  color: #2d333f !important;
}

/* Desktop menu */
.desktop-menu {
  display: flex;
  gap: 10px;
}

/* Mobile menu button */
.mobile-menu-btn {
  display: none;
  background: transparent;
  border: 2px solid #FFD700;
  color: #FFD700;
  font-size: 1.5rem;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background-color: #FFD700;
  color: #333;
}

/* Mobile menu dropdown */
.mobile-menu {
  display: none;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  margin-top: 15px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-direction: column;
  gap: 10px;
}

.mobile-menu-item {
  padding: 12px 15px;
  color: #333;
  text-decoration: none;
  font-family: 'Noto Sans Arabic', sans-serif;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mobile-menu-item i {
  width: 20px;
  color: #FFD700;
}

.mobile-menu-item:hover {
  background-color: #f5f5f5;
}

/* Button styles */
.btn-outline-light {
  background-color: white;
  color: #2d333f;
  border: 1px solid #FFD700;
  padding: 8px 20px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: 'Noto Sans Arabic', sans-serif;
  text-decoration: none;
  display: inline-block;
}

.btn-outline-light:hover {
  background-color: #FFD700;
  color: #333;
  border-color: #FFD700;
}

.btn-light {
  background-color: #FFD700;
  color: #2d333f;
  border: 1px solid #FFD700;
  padding: 8px 20px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: 'Noto Sans Arabic', sans-serif;
  text-decoration: none;
  display: inline-block;
}

.btn-light:hover {
  background-color: #ffc107;
  border-color: #ffc107;
}

.btn-outline-light-danger {
  background-color: white;
  color: #2d333f;
  border: 1px solid #dc3545;
  padding: 8px 20px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: 'Noto Sans Arabic', sans-serif;
  cursor: pointer;
}

.btn-outline-light-danger:hover {
  background-color: #dc3545;
  color: white;
}

.navbar-solid .btn-outline-light {
  background-color: #FFD700;
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

/* Responsive styles */
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-menu {
    display: flex;
  }

  .navbar {
    padding: 12px 4%;
  }

  .navbar-logo {
    height: 35px;
  }

  .navbar-brand {
    font-size: 1.3rem;
  }
}

@media (min-width: 769px) {
  .mobile-menu-btn,
  .mobile-menu {
    display: none !important;
  }

  .desktop-menu {
    display: flex;
  }
}
</style>
