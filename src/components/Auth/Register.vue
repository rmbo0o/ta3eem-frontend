<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-sm p-4">
          <h2 class="text-center mb-4">إنشاء حساب جديد</h2>
          <form @submit.prevent="register" novalidate>
            <div class="mb-3">
              <label for="name" class="form-label">الاسم</label>
              <input
                type="text"
                v-model="name"
                class="form-control"
                placeholder="أدخل اسمك"
                required
              />
            </div>

            <div class="mb-3">
              <label for="email" class="form-label">البريد الإلكتروني</label>
              <input
                type="email"
                v-model="email"
                class="form-control"
                placeholder="أدخل بريدك الإلكتروني"
                required
              />
            </div>

            <div class="mb-3 position-relative password-input-container">
              <label for="password" class="form-label">كلمة المرور</label>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                class="form-control"
                placeholder="أدخل كلمة المرور"
                required
              />
              <i
                :class="showPassword ? 'bi bi-eye-slash-fill toggle-password' : 'bi bi-eye-fill toggle-password'"
                @click="togglePassword"
              ></i>
            </div>

            <button type="submit" class="btn btn-success w-100 mt-3" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span v-if="!loading">إنشاء حساب</span>
            </button>
          </form>
          <p class="mt-3 text-center">
            لديك حساب بالفعل؟
            <router-link to="/login" class="text-decoration-none">تسجيل الدخول</router-link>
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
        alert("هذا البريد الإلكتروني مسجل بالفعل");
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
  direction: rtl;
  text-align: right;
}

.card {
  background: #f8f9fa;
  border-radius: 8px;
}

.card h2 {
  font-family: 'Cairo', sans-serif;
  font-weight: 700;
}

.form-label {
  font-family: 'Cairo', sans-serif;
  font-weight: 600;
}

.form-control {
  font-family: 'Cairo', sans-serif;
  text-align: right;
}

.password-input-container {
  position: relative;
}

.toggle-password {
  position: absolute;
  left: 10px;
  right: auto;
  top: 35px;
  cursor: pointer;
  font-size: 18px;
  color: #6c757d;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #495057;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  font-family: 'Cairo', sans-serif;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

p {
  font-family: 'Cairo', sans-serif;
}

a {
  font-family: 'Cairo', sans-serif;
}
</style>
