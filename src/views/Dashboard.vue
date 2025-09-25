<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">Manage Menu</h1>

    <!-- Add Item Form -->
    <form @submit.prevent="addItem" class="crud-form">
      <h2 class="form-title">Add New Item</h2>
      <input v-model="newItem.food_name" placeholder="Name" required class="form-input" />
      <textarea v-model="newItem.description" placeholder="Description" class="form-textarea"></textarea>
      <input
        v-model.number="newItem.price"
        type="number"
        step="0.25"
        min="0"
        placeholder="Price"
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
          <span class="upload-text">Upload Photo</span>
        </label>
        <div v-if="newItem.image_preview" class="image-preview">
          <img :src="newItem.image_preview" class="preview-image" />
          <button @click="removeImage" type="button" class="remove-image-btn">×</button>
        </div>
      </div>

      <input
        v-model="newItem.social_media_link"
        placeholder="Instagram Link (optional)"
        type="url"
        class="form-input"
      />

      <!-- Category Dropdown -->
      <select v-model="newItem.category_id" class="form-select">
        <option disabled value="">Select Category</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>

      <button type="submit" :disabled="isLoading" class="submit-btn">
        {{ isLoading ? "Adding..." : "Add Item" }}
      </button>
      <p v-if="addError" class="error-message">{{ addError }}</p>
    </form>

    <!-- Items List -->
    <div v-if="isLoading && menuItems.length === 0" class="loading-state">
      Loading menu...
    </div>

    <div v-else class="items-grid">
      <div v-for="item in menuItems" :key="item.id" class="menu-card">
        <!-- Display Mode -->
        <div v-if="!editingItem || editingItem.id !== item.id">
          <h3 class="item-name">{{ item.food_name }}</h3>
          <p class="item-description">{{ item.description }}</p>
          <p class="item-price">Price: ${{ formatPrice(item.price) }}</p>
          <p v-if="categories.length && item.category_id" class="item-category">
            <strong>Category:</strong>
            {{ getCategoryName(item.category_id) }}
          </p>

          <img
            v-if="item.image"
            :src="item.image.startsWith('http') ? item.image : `https://ta3eem-backend.onrender.com/uploads/menus/${item.image}`"
            alt="Menu item image"
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
            <button @click="startEdit(item)" class="action-btn edit-btn">Edit</button>
            <button @click="confirmDelete(item.id)" class="action-btn delete-btn">Delete</button>
          </div>
        </div>

        <!-- Edit Mode -->
        <form v-else @submit.prevent="saveEdit" class="edit-form">
          <input v-model="editingItem.food_name" placeholder="Name" required class="form-input" />
          <textarea v-model="editingItem.description" placeholder="Description" required class="form-textarea"></textarea>
          <input
            v-model.number="editingItem.price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            required
            class="form-input"
          />

          <!-- <div class="upload-section">
            <label class="upload-label">
              <input
                type="file"
                accept="image/*"
                @change="handleEditImage"
                class="file-input"
              />
              <span class="upload-text">Change Photo</span>
            </label>
            <div v-if="editingItem.image_url" class="image-preview">
              <img :src="editingItem.image_url" class="preview-image" />
              <button @click="removeEditImage" type="button" class="remove-image-btn">×</button>
            </div>
          </div> -->

          <input
            v-model="editingItem.social_media_link"
            placeholder="Instagram Link (optional)"
            type="url"
            class="form-input"
          />

          <select v-model="editingItem.category_id" required class="form-select">
            <option disabled value="">Select Category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>

          <div class="edit-actions">
            <button type="submit" :disabled="isLoading" class="save-btn">
              {{ isLoading ? "Saving..." : "Save" }}
            </button>
            <button type="button" @click="cancelEdit" class="cancel-btn">Cancel</button>
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
      return found ? found.name : 'Unknown';
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
        console.error('Failed to load menu:', err);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchCategories() {
      try {
        const res = await axios.get('/categories');
        this.categories = res.data;
      } catch (err) {
        console.error('Failed to load categories:', err);
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
      console.error('Image failed to load:', event.target.src);
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
        console.error('Error in addItem:', err);
        this.addError = err.response?.data?.message || 'Failed to add item';
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
    // handleEditImage(event) {
    //   const file = event.target.files[0];
    //   if (file) {
    //     this.editingItem.image_file = file;
    //     this.editingItem.image_url = URL.createObjectURL(file);
    //   }
    // },
    // removeEditImage() {
    //   this.editingItem.image_file = null;
    //   this.editingItem.image_url = '';
    // },
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

    const response = await axios.put(`/menu/${this.editingItem.id}`, payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    await this.fetchMenu();
    this.editingItem = null;
  } catch (err) {
    if (err.response) {
      this.editError = err.response.data.message ||
                      `Server error (${err.response.status}): Please check the data and try again`;
    } else if (err.request) {
      this.editError = 'No response from server. Please check your connection.';
    } else {
      this.editError = 'Request failed to send. Please try again.';
    }
  } finally {
    this.isLoading = false;
  }
},
    cancelEdit() {
      this.editingItem = null;
    },
    confirmDelete(id) {
      if (confirm('Delete this item permanently?')) {
        this.deleteItem(id);
      }
    },
    async deleteItem(id) {
      this.isLoading = true;
      try {
        await axios.delete(`/menu/${id}`);
        this.menuItems = this.menuItems.filter(item => item.id !== id);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete item');
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
/* Color Variables */


/* Base Styles */
.dashboard-container {

  color: #ffffff;
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-title {
  color: #FFD700;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

/* Form Styles */
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
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #555;
  background-color: #2d333f;
  color: #ffffff;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFD700'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

/* Upload Section */
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
}

.upload-text:hover {
  background-color: #ffdf33
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
  right: -10px;
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

/* Buttons */
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
}

.submit-btn:hover:not(:disabled), .save-btn:hover:not(:disabled) {
  background-color: #ffdf33
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
}

.cancel-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Items Grid */
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
}

.item-description {
  color: #e0e0e0;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.item-price {
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.item-category {
  color: #e0e0e0;
  margin-bottom: 0.75rem;
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
}

.edit-btn {
  background-color: #FFD700;
  color: #2d333f;
}

.edit-btn:hover {
  background-color: #ffdf33
}

.delete-btn {
  background-color: transparent;
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
}

.delete-btn:hover {
  background-color: rgba(255, 107, 107, 0.1);
}

/* Current Image in Edit Mode */
.current-image {
  margin-bottom: 1rem;
}

.current-image-label {
  color: #e0e0e0;
  margin-bottom: 0.5rem;
}

.current-image-preview {
  max-width: 150px;
  max-height: 150px;
  border-radius: 6px;
  border: 2px solid #FFD700;
}

/* Error Messages */
.error-message {
  color: #ff6b6b;
  margin-top: 1rem;
  text-align: center;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 2rem;
  color: #e0e0e0;
}

/* Responsive Design */
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
