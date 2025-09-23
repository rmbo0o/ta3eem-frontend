<!-- src/views/layouts/DashboardLayout.vue -->
<template>
  <div class="dashboard-layout">
    <div class="sidebar">
      <!-- Dashboard navigation -->
      <nav>
        <router-link to="/dashboard/profile">
          <i class="fas fa-user"></i> Profile
        </router-link>
        <router-link to="/dashboard/menu">
          <i class="fas fa-utensils"></i> Menu
        </router-link>
      </nav>
    </div>

    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: #343a40;
  color: white;
  padding: 20px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar a {
  color: white;
  text-decoration: none;
  padding: 10px;
  border-radius: 4px;
}

.sidebar a:hover {
  background: #495057;
}

.sidebar a.router-link-exact-active {
  background: #007bff;
}

.main-content {
  flex: 1;
  padding: 20px;
  background: #f8f9fa;
}
</style>
