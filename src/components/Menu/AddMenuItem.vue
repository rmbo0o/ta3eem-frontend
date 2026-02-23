<template>
  <div class="menu-form">
    <h2>إضافة عنصر جديد</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>الاسم</label>
        <input v-model="form.name" type="text" class="form-control" required>
      </div>
      <div class="form-group">
        <label>الوصف</label>
        <textarea v-model="form.description" class="form-control" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>السعر (ر.س)</label>
        <input v-model="form.price" type="number" step="0.01" class="form-control" required>
      </div>
      <div class="form-group">
        <label>رابط الصورة</label>
        <input v-model="form.image" type="url" class="form-control">
      </div>
      <button type="submit" class="btn btn-primary">حفظ</button>
      <router-link to="/dashboard" class="btn btn-link">إلغاء</router-link>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        description: '',
        price: 0,
        image: ''
      }
    }
  },
  methods: {
    async handleSubmit() {
      try {
        await this.$http.post('/menu', this.form)
        this.$router.push('/dashboard')
      } catch (error) {
        console.error('خطأ:', error)
        alert(error.response?.data?.message || 'فشل في إضافة العنصر')
      }
    }
  }
}
</script>

<style scoped>
.menu-form {
  direction: rtl;
  text-align: right;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.menu-form h2 {
  font-family: 'Cairo', sans-serif;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-family: 'Cairo', sans-serif;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control {
  font-family: 'Cairo', sans-serif;
  text-align: right;
}

.btn-primary {
  background-color: #333;
  border-color: #333;
  font-family: 'Cairo', sans-serif;
  margin-left: 10px;
}

.btn-primary:hover {
  background-color: #555;
  border-color: #555;
}

.btn-link {
  font-family: 'Cairo', sans-serif;
  color: #666;
}
</style>
