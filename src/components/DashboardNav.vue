<template>
  <div class="dashboard-nav">
    <div class="dashboard-nav-container">
      <router-link to="/dashboard" class="dashboard-nav-item" :class="{ active: isActive('/dashboard') }">
        <i class="fas fa-utensils"></i>
        <span>إدارة القائمة</span>
      </router-link>

      <router-link to="/dashboard/profile" class="dashboard-nav-item" :class="{ active: isActive('/dashboard/profile') }">
        <i class="fas fa-user"></i>
        <span>الملف الشخصي</span>
      </router-link>

      <button @click="logout" class="dashboard-nav-item logout-btn">
        <i class="fas fa-sign-out-alt"></i>
        <span>تسجيل الخروج</span>
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export default {
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const isActive = (path) => {
      return router.currentRoute.value.path === path
    }

    const logout = () => {
      authStore.logout()
      router.push('/login')
    }

    return {
      isActive,
      logout
    }
  }
}
</script>

<style scoped>
.dashboard-nav {
  background-color: #2d333f;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dashboard-nav-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.dashboard-nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  color: #fff;
  text-decoration: none;
  font-family: 'Noto Sans Arabic', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: none;
  background: transparent;
  cursor: pointer;
}

.dashboard-nav-item i {
  font-size: 1.1rem;
  color: #FFD700;
}

.dashboard-nav-item:hover {
  background-color: rgba(255, 215, 0, 0.1);
}

.dashboard-nav-item.active {
  background-color: #FFD700;
  color: #2d333f;
}

.dashboard-nav-item.active i {
  color: #2d333f;
}

.logout-btn {
  border: 1px solid #dc3545;
}

.logout-btn i {
  color: #dc3545;
}

.logout-btn:hover {
  background-color: #dc3545;
}

.logout-btn:hover i {
  color: white;
}

@media (max-width: 768px) {
  .dashboard-nav-container {
    flex-direction: column;
  }

  .dashboard-nav-item {
    width: 100%;
    justify-content: center;
  }
}
</style>
