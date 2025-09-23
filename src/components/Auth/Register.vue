<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-sm p-4">
          <h2 class="text-center mb-4">Register</h2>
          <form @submit.prevent="register" novalidate>
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input
                type="text"
                v-model="name"
                class="form-control"
                placeholder="Enter your name"
                required
              />
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

            <button type="submit" class="btn btn-success w-100 mt-3" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span v-if="!loading">Register</span>
            </button>
          </form>
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
      name: "",
      email: "",
      password: "",
      loading: false,
      showPassword: false,
    };
  },
  methods: {
    async register() {
      const authStore = useAuthStore();
      this.loading = true;
      try {
        await authStore.register({ name: this.name, email: this.email, password: this.password });
        this.$router.push("/dashboard");
      } catch (error) {
        alert("This email is already registered.");
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
</style>
