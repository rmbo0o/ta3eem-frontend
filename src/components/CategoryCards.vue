<template>
  <div class="category-container">
    <!-- Category Cards -->
    <div class="category-cards">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-card"
        @click="fetchCategoryItems(category.id, category.name)"
      >
        <h3>{{ category.name }}</h3>
      </div>
    </div>

    <!-- Category Items -->
    <div v-if="selectedCategoryName" class="category-items-section">
      <div class="category-header">
        <h2>{{ selectedCategoryName }} Items</h2>
        <button @click="fetchAllItems" class="btn btn-outline-secondary">Show All</button>
      </div>

      <div v-if="loading" class="loading-spinner">
        <div class="spinner-border text-warning" role="status"></div>
      </div>

      <div v-else class="items-container">
        <div v-if="categoryItems.length === 0" class="no-items">
          <p>No items found in this category.</p>
        </div>

        <div v-for="item in categoryItems" :key="item.id" class="item-card">
          <div class="item-image">
            <img :src="getImageUrl(item.image_url)" :alt="item.food_name" />
          </div>
          <div class="item-content">
            <h4>{{ item.food_name }}</h4>
            <p class="item-description">{{ item.description }}</p>
            <div class="item-footer">
              <span class="price">${{ item.price }}</span>
              <button @click.stop="viewOwnerMenu(item.owner_id)" class="btn btn-view-menu">
                View Owner's Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ta3eem-frontendnew.onrender.com'

// Reactive data
const categories = ref([
  { id: 1, name: 'Breakfast' },
  { id: 2, name: 'Lunch' },
  { id: 3, name: 'Dinner' },
  { id: 4, name: 'Drinks' },
  { id: 5, name: 'Desserts' },
])
const selectedCategoryId = ref(null)
const selectedCategoryName = ref('')
const categoryItems = ref([])
const loading = ref(false)

// Fetch items for selected category
// Fetch items for selected category
async function fetchCategoryItems(categoryId, categoryName) {
  selectedCategoryId.value = categoryId
  selectedCategoryName.value = categoryName
  loading.value = true
  categoryItems.value = [] // Clear previous items

  try {
    const response = await axios.get(`${API_BASE_URL}/categories/food-items`, {
      params: {
        category_id: categoryId,
        category_name: categoryName,
      },
    })

    categoryItems.value = response.data || []
  } catch (error) {
    console.error('Error fetching category items:', error)
    categoryItems.value = []
  } finally {
    loading.value = false
  }
}

// Fetch all items (for "Show All" button)
// async function fetchAllItems() {
//   loading.value = true;
//   try {
//     const response = await axios.get(`${API_BASE_URL}/api/menu/food-items`);
//     categoryItems.value = response.data || [];
//   } catch (error) {
//     console.error('Error fetching all items:', error);
//     categoryItems.value = [];
//   } finally {
//     loading.value = false;
//   }
// }

// View owner's menu
const viewOwnerMenu = (ownerId) => {
  console.log('Navigating to owner:', ownerId)
  console.log('Router available:', router)
  if (ownerId) {
    router.push(`/owner/${ownerId}/menu`)
  }
}

// Handle image URLs
function getImageUrl(imagePath) {
  if (!imagePath) {
    return '/placeholder-food.jpg' // Default placeholder image
  }
  return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}${imagePath}`
}

// Initialize component
onMounted(() => {
  // You can fetch initial data here if needed
})
</script>

<style scoped>
.category-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.category-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.category-card {
  background: #ffd700;
  color: #333;
  border-radius: 10px;
  padding: 55px 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  border: none;
  color: #4b515e;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background: #ffc107;
  color: black;
}

.category-card h3 {
  margin: 0;
  font-size: 1.2rem;

  font-weight: 600;
}
.category-card h3:hover {
  color: black;
}
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.category-header h2 {
  margin: 0;
  color: #333;
}

.items-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.item-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.item-image {
  height: 200px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-card:hover .item-image img {
  transform: scale(1.05);
}

.item-content {
  padding: 15px;
}

.item-content h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.1rem;
}

.item-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
  display: -webkit-box;
  display: -moz-box;
  -webkit-line-clamp: 2;
  -moz-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
}

.btn-view-menu {
  background-color: #333;
  color: #ffd700;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-view-menu:hover {
  background-color: #555;
  color: #ffc107;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  padding: 50px;
}

.no-items {
  text-align: center;
  padding: 30px;
  color: #666;
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .category-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .items-container {
    grid-template-columns: 1fr;
  }
}
</style>
