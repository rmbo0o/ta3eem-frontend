<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">إدارة القائمة</h1>
      <div style="background: #333; color: #FFD700; padding: 15px; margin-bottom: 20px; border-radius: 5px; text-align: center;">
      <div style="font-size: 1.2rem; margin-bottom: 10px;">🔧 وضع التصحيح</div>
      <div style="display: flex; gap: 20px; justify-content: center;">
        <div>حالة التحميل: <strong>{{ isLoading ? '✅ جاري التحميل' : '❌ غير نشط' }}</strong></div>
        <button
          @click="isLoading = false"
          style="background: #FFD700; color: #333; border: none; padding: 5px 15px; border-radius: 3px; cursor: pointer;">
          🔓 إعادة تعيين
        </button>
        <button
          @click="testAddItem"
          style="background: #4CAF50; color: white; border: none; padding: 5px 15px; border-radius: 3px; cursor: pointer;">
          🧪 اختبار الإضافة
        </button>
      </div>
    </div>
    <!-- Add Item Form -->
    <form @submit.prevent="addItem" class="crud-form">
      <h2 class="form-title">إضافة عنصر جديد</h2>
      <input v-model="newItem.food_name" placeholder="الاسم" required class="form-input" />
      <textarea v-model="newItem.description" placeholder="الوصف" class="form-textarea"></textarea>
      <input
        v-model.number="newItem.price"
        type="number"
        step="0.25"
        min="0"
        placeholder="السعر (ر.س)"
        required
        class="form-input"
        @change="newItem.price = Number(newItem.price)"
        @input="validatePrice"
      />
      <div class="upload-section">
        <label class="upload-label">
          <input
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            ref="fileInput"
            class="file-input"
          />
          <span class="upload-text">رفع صورة</span>
        </label>
        <div v-if="newItem.image_preview" class="image-preview">
          <img :src="newItem.image_preview" class="preview-image" />
          <button @click="removeImage" type="button" class="remove-image-btn">×</button>
        </div>
      </div>

      <input
        v-model="newItem.social_media_link"
        placeholder="رابط إنستغرام (اختياري)"
        type="url"
        class="form-input"
      />

      <!-- Category Dropdown -->
      <select v-model="newItem.category_id" class="form-select">
        <option disabled value="">اختر الفئة</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>

      <button type="submit" :disabled="isLoading" class="submit-btn">
        {{ isLoading ? "جاري الإضافة..." : "إضافة عنصر" }}
      </button>
      <p v-if="addError" class="error-message">{{ addError }}</p>
    </form>

    <!-- Items List -->
    <div v-if="isLoading && menuItems.length === 0" class="loading-state">
      جاري تحميل القائمة...
    </div>

    <div v-else class="items-grid">
      <div v-for="item in menuItems" :key="item.id" class="menu-card">
        <!-- Display Mode -->
        <div v-if="!editingItem || editingItem.id !== item.id">
          <h3 class="item-name">{{ item.food_name }}</h3>
          <p class="item-description">{{ item.description }}</p>
          <p class="item-price">السعر: {{ formatPrice(item.price) }} ر.س</p>
          <p v-if="categories.length && item.category_id" class="item-category">
            <strong>الفئة:</strong>
            {{ getCategoryName(item.category_id) }}
          </p>

          <img
            v-if="item.image"
            :src="item.image.startsWith('http') ? item.image : `https://ta3eem-backend.onrender.com${item.image}`"
            alt="صورة العنصر"
            @error="handleImageError"
            class="item-image"
          >
          <div v-if="item.social_media_link" class="social-link">
            <a
              :href="ensureHttp(item.social_media_link)"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link-anchor"
            >
              <i class="fab fa-instagram"></i> {{ formatSocialLink(item.social_media_link) }}
            </a>
          </div>
          <div v-if="item.category_name" class="category-badge">
            <span class="badge-text">{{ item.category_name }}</span>
          </div>
          <div class="card-actions">
            <button @click="startEdit(item)" class="action-btn edit-btn">تعديل</button>
            <button @click="confirmDelete(item.id)" class="action-btn delete-btn">حذف</button>
          </div>
        </div>

        <!-- Edit Mode -->
        <form v-else @submit.prevent="saveEdit" class="edit-form">
          <input v-model="editingItem.food_name" placeholder="الاسم" required class="form-input" />
          <textarea v-model="editingItem.description" placeholder="الوصف" required class="form-textarea"></textarea>
          <input
            v-model.number="editingItem.price"
            type="number"
            step="0.01"
            min="0"
            placeholder="السعر"
            required
            class="form-input"
          />

          <input
            v-model="editingItem.social_media_link"
            placeholder="رابط إنستغرام (اختياري)"
            type="url"
            class="form-input"
          />

          <select v-model="editingItem.category_id" required class="form-select">
            <option disabled value="">اختر الفئة</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>

          <div class="edit-actions">
            <button type="submit" :disabled="isLoading" class="save-btn">
              {{ isLoading ? "جاري الحفظ..." : "حفظ" }}
            </button>
            <button type="button" @click="cancelEdit" class="cancel-btn">إلغاء</button>
          </div>
          <p v-if="editError" class="error-message">{{ editError }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/api';

export default {
  data() {
    return {
      menuItems: [],
      categories: [],
      newItem: {
        food_name: '',
        description: '',
        price: 0,
        image_url: '',
        image_preview: '',
        image_file: null,
        social_media_link: '',
        category_id: ''
      },
      editingItem: null,
      isLoading: false,
      addError: null,
      editError: null
    };
  },
  methods: {
    validatePrice() {
      if (isNaN(Number(this.newItem.price))) {
        this.newItem.price = 0;
      }
    },
    formatPrice(price) {
      const num = typeof price === 'string' ? parseFloat(price) : Number(price);
      return isNaN(num) ? '0.00' : num.toFixed(2);
    },
    getCategoryName(id) {
      const found = this.categories.find(cat => cat.id === id);
      return found ? found.name : 'غير معروفة';
    },
    async fetchMenu() {
      this.isLoading = true;
      try {
        const response = await axios.get('/menu', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.menuItems = response.data;
      } catch (err) {
        console.error('فشل تحميل القائمة:', err);
      } finally {
        this.loading = false;
      }
    },
    async fetchCategories() {
      try {
        const res = await axios.get('/categories');
        this.categories = res.data;
      } catch (err) {
        console.error('فشل تحميل الفئات:', err);
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.newItem.image_file = file;
        this.newItem.image_preview = URL.createObjectURL(file);
      }
    },
    handleImageError(event) {
      console.error('فشل تحميل الصورة:', event.target.src);
      event.target.style.display = 'none';
    },
    removeImage() {
      this.newItem.image_file = null;
      this.newItem.image_preview = '';
      this.newItem.image_url = '';
      this.$refs.fileInput.value = '';
    },
    async addItem() {
      this.addError = null;
      this.isLoading = true;
      try {
        const formData = new FormData();
        formData.append('food_name', this.newItem.food_name);
        formData.append('description', this.newItem.description);
        formData.append('price', this.newItem.price);
        formData.append('social_media_link', this.newItem.social_media_link);
        formData.append('category_id', this.newItem.category_id);
        if (this.newItem.image_file) {
          formData.append('image', this.newItem.image_file);
        }
        await axios.post('/menu', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        await this.fetchMenu();
        this.newItem = {
          food_name: '',
          description: '',
          price: 0,
          image_url: '',
          image_file: null,
          image_preview: '',
          social_media_link: '',
          category_id: ''
        };
      } catch (err) {
        console.error('خطأ في إضافة العنصر:', err);
        this.addError = err.response?.data?.message || 'فشل إضافة العنصر';
      } finally {
        this.isLoading = false;
      }
    },
    startEdit(item) {
      this.editingItem = {
        ...item,
      };
      this.editError = null;
    },
    async saveEdit() {
      this.editError = null;
      this.isLoading = true;
      try {
        const payload = {
          food_name: this.editingItem.food_name,
          description: this.editingItem.description,
          price: this.editingItem.price,
          social_media_link: this.editingItem.social_media_link,
          category_id: this.editingItem.category_id
        };

        await axios.put(`/menu/${this.editingItem.id}`, payload, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        await this.fetchMenu();
        this.editingItem = null;
      } catch (err) {
        if (err.response) {
          this.editError = err.response.data.message ||
            `خطأ في الخادم (${err.response.status})`;
        } else if (err.request) {
          this.editError = 'لا يوجد استجابة من الخادم';
        } else {
          this.editError = 'فشل إرسال الطلب';
        }
      } finally {
        this.isLoading = false;
      }
    },
    cancelEdit() {
      this.editingItem = null;
    },
    confirmDelete(id) {
      if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
        this.deleteItem(id);
      }
    },
    async deleteItem(id) {
      this.isLoading = true;
      try {
        await axios.delete(`/menu/${id}`);
        this.menuItems = this.menuItems.filter(item => item.id !== id);
      } catch (err) {
        alert(err.response?.data?.message || 'فشل حذف العنصر');
      } finally {
        this.isLoading = false;
      }
    },
    ensureHttp(link) {
      if (!link) return '';
      return link.startsWith('http') ? link : `https://${link}`;
    },
    formatSocialLink(link) {
      if (!link) return '';
      const match = link.match(/instagram\.com\/([^/]+)/);
      return match ? `@${match[1]}` : link;
    }
  },
  created() {
    this.fetchMenu();
    this.fetchCategories();
  }
};
</script>

<style scoped>
.dashboard-container {
  color: #ffffff;
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  direction: rtl;
  text-align: right;
}

.dashboard-title {
  color: #FFD700;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-family: 'Cairo', sans-serif;
  font-weight: 700;
}

.crud-form, .edit-form {
  background-color: #3a4252;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-title {
  color: #FFD700;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-family: 'Cairo', sans-serif;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #555;
  background-color: #2d333f;
  color: #ffffff;
  font-family: 'Cairo', sans-serif;
  text-align: right;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFD700'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: left 0.75rem center;
  background-size: 1rem;
}

.upload-section {
  margin-bottom: 1rem;
}

.upload-label {
  display: inline-block;
  cursor: pointer;
}

.file-input {
  display: none;
}

.upload-text {
  display: inline-block;
  padding: 0.75rem 1rem;
  background-color: #FFD700;
  color: #2d333f;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: 'Cairo', sans-serif;
}

.upload-text:hover {
  background-color: #ffdf33;
}

.image-preview {
  position: relative;
  display: inline-block;
  margin-top: 1rem;
}

.preview-image {
  max-width: 150px;
  max-height: 150px;
  border-radius: 6px;
  border: 2px solid #FFD700;
}

.remove-image-btn {
  position: absolute;
  top: -10px;
  left: -10px;
  right: auto;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-image-btn:hover {
  transform: scale(1.1);
}

.submit-btn, .save-btn {
  background-color: #FFD700;
  color: #2d333f;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  font-family: 'Cairo', sans-serif;
}

.submit-btn:hover:not(:disabled), .save-btn:hover:not(:disabled) {
  background-color: #ffdf33;
}

.submit-btn:disabled, .save-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: transparent;
  color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 0.5rem;
  font-family: 'Cairo', sans-serif;
}

.cancel-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.menu-card {
  background-color: #3a4252;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.menu-card:hover {
  transform: translateY(-5px);
}

.item-name {
  color: #FFD700;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  font-family: 'Cairo', sans-serif;
}

.item-description {
  color: #e0e0e0;
  margin-bottom: 0.75rem;
  line-height: 1.5;
  font-family: 'Cairo', sans-serif;
}

.item-price {
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 0.75rem;
  font-family: 'Cairo', sans-serif;
}

.item-category {
  color: #e0e0e0;
  margin-bottom: 0.75rem;
  font-family: 'Cairo', sans-serif;
}

.item-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 2px solid #FFD700;
}

.social-link {
  margin-bottom: 1rem;
}

.social-link-anchor {
  color: #FFD700;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: 'Cairo', sans-serif;
}

.social-link-anchor:hover {
  text-decoration: underline;
}

.category-badge {
  margin-bottom: 1rem;
}

.badge-text {
  background-color: #FFD700;
  color: #2d333f;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: 'Cairo', sans-serif;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.action-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Cairo', sans-serif;
}

.edit-btn {
  background-color: #FFD700;
  color: #2d333f;
}

.edit-btn:hover {
  background-color: #ffdf33;
}

.delete-btn {
  background-color: transparent;
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
}

.delete-btn:hover {
  background-color: rgba(255, 107, 107, 0.1);
}

.error-message {
  color: #ff6b6b;
  margin-top: 1rem;
  text-align: center;
  font-family: 'Cairo', sans-serif;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #e0e0e0;
  font-family: 'Cairo', sans-serif;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1.5rem;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .dashboard-title {
    font-size: 1.5rem;
  }

  .form-title {
    font-size: 1.25rem;
  }

  .card-actions {
    flex-direction: column;
  }
}
</style>
