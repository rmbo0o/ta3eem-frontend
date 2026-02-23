<template>
  <div class="edit-menu-item">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>تعديل عنصر القائمة</h2>
      <router-link to="/dashboard" class="btn btn-outline-secondary">
        العودة للوحة التحكم
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>الاسم</label>
        <input v-model="form.name" type="text" class="form-control" required>
      </div>

      <div class="form-group">
        <label>الوصف</label>
        <textarea v-model="form.description" class="form-control" rows="3" required></textarea>
      </div>

      <div class="form-group">
        <label>السعر (ر.س)</label>
        <input v-model="form.price" type="number" min="0" step="0.01" class="form-control" required>
      </div>

      <div class="form-group">
        <label>رابط الصورة</label>
        <input v-model="form.image" type="url" class="form-control">
        <small class="form-text text-muted">اتركه فارغاً لاستخدام الصورة الافتراضية</small>
      </div>

      <div class="form-group">
        <img v-if="form.image" :src="form.image" class="img-thumbnail preview-image">
      </div>

      <div class="form-group d-flex justify-content-between">
        <button type="submit" class="btn btn-primary">حفظ التغييرات</button>
        <button type="button" @click="handleDelete" class="btn btn-danger">حذف العنصر</button>
      </div>
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
  async created() {
    await this.fetchMenuItem()
  },
  methods: {
    async fetchMenuItem() {
      try {
        const { data } = await this.$http.get(`/menu/${this.$route.params.id}`)
        this.form = {
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.image || ''
        }
      } catch (error) {
        console.error('خطأ:', error)
        alert(error.response?.data?.message || 'فشل في جلب بيانات العنصر')
        this.$router.push('/dashboard')
      }
    },
    async handleSubmit() {
      try {
        await this.$http.put(`/menu/${this.$route.params.id}`, this.form)
        this.$router.push('/dashboard')
      } catch (error) {
        console.error('خطأ:', error)
        alert(error.response?.data?.message || 'فشل في تحديث العنصر')
      }
    },
    async handleDelete() {
      if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
        try {
          await this.$http.delete(`/menu/${this.$route.params.id}`)
          this.$router.push('/dashboard')
        } catch (error) {
          console.error('خطأ:', error)
          alert(error.response?.data?.message || 'فشل في حذف العنصر')
        }
      }
    }
  }
}
</script>

<style scoped>
.edit-menu-item {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  direction: rtl;
  text-align: right;
}

.edit-menu-item h2 {
  font-family: 'Cairo', sans-serif;
  color: #333;
  margin: 0;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  display: block;
  margin-top: 10px;
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
}

.btn-primary:hover {
  background-color: #555;
  border-color: #555;
}

.btn-danger {
  font-family: 'Cairo', sans-serif;
}

.btn-outline-secondary {
  font-family: 'Cairo', sans-serif;
}

.text-muted {
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
}
</style>
