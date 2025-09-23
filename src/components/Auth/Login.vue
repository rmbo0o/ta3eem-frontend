<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-sm p-4">
          <h2 class="text-center mb-4">Login</h2>
          <form @submit.prevent="login" novalidate>
            <!-- Error message display -->
            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>

            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                v-model="email"
                class="form-control"
                placeholder="Enter your email"
                required
              />
            </div>

            <div class="mb-3 position-relative password-input-container">
              <label for="password" class="form-label">Password</label>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                class="form-control"
                placeholder="Enter your password"
                required
              />
              <i
                :class="showPassword ? 'bi bi-eye-slash-fill toggle-password' : 'bi bi-eye-fill toggle-password'"
                @click="togglePassword"
              ></i>
            </div>

            <button type="submit" class="btn btn-primary w-100 mt-3" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span v-if="!loading">Login</span>
            </button>
          </form>
          <p class="mt-3 text-center">
            Don't have an account?
            <router-link to="/register" class="text-decoration-none">Register</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";

export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      showPassword: false,
      errorMessage: "", // Add error message data property
    };
  },
  methods: {
    async login() {
      const authStore = useAuthStore();
      this.loading = true;
      this.errorMessage = ""; // Clear previous error
      try {
        await authStore.login({ email: this.email, password: this.password });
        this.$router.push("/dashboard");
      } catch (error) {
        this.errorMessage = "Invalid email or password."; // Set error message instead of alert
      } finally {
        this.loading = false;
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1600px;
}

.card {
  background: #f8f9fa;
  border-radius: 8px;
}

.password-input-container {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 35px;
  cursor: pointer;
  font-size: 18px;
  color: #6c757d;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #495057;
}

/* Add styling for the error message */
.alert-danger {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}
</style>
