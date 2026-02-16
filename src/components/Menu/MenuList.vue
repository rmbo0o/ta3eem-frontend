<template>
  <div class="menu-container">
    <div>
                            <button
                @click="viewOwnerMenu(ownerId)"
                class=" btn btn-view-menu"
              >
                View Owner's Menu
              </button>
      </div>
    <div v-if="loading" class="loading">Loading menu...</div>

    <div v-else-if="menuItems.length > 0" class="row">
      <div v-for="item in displayedItems" :key="item.id" class="col-md-6 col-lg-4 mb-4">


        <div class="card h-100">
          <img
            v-if="item.image || item.image_url"
            :src="getImageUrl(item.image || item.image_url)"
            class="card-img-top"
            style="height: 200px; object-fit: cover;"
            @error="handleImageError"
          >
          <div class="card-body">
            <h5 class="card-title">{{ item.food_name }}</h5>
            <p class="card-text">{{ item.description }}</p>
            <p class="text-success">${{ formatPrice(item.price) }}</p>

            <div v-if="item.social_media_link" class="social-link mt-2">
              <a
                :href="ensureHttp(item.social_media_link)"
                target="_blank"
                rel="noopener noreferrer"
                class="text-decoration-none"
              >
                <i class="fab fa-instagram me-1"></i>
                {{ formatSocialLink(item.social_media_link) }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>No menu items available</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from 'vue-router'

export default {
  props: {
    ownerId: {
      type: [Number, String],
      default: null
    },
    limit: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      menuItems: [],
      loading: true,
      error: null
    }
  },
  methods: {
    formatPrice(price) {
      const num = parseFloat(price);
      return isNaN(num) ? '0.00' : num.toFixed(2);
    },
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      if (imagePath.startsWith('http')) return imagePath;
      return `https://ta3eem-backend.onrender.com${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    },
    handleImageError(event) {
      console.error('Image failed to load:', event.target.src);
      event.target.style.display = 'none';
    },
    ensureHttp(link) {
      if (!link) return '';
      return link.startsWith('http') ? link : `https://${link}`;
    },
    formatSocialLink(link) {
      if (!link) return '';
      const match = link.match(/instagram\.com\/([^/]+)/);
      return match ? `@${match[1]}` : link;
    },
    viewOwnerMenu(ownerId) {
  console.log('Navigating to owner:', ownerId)
  console.log('Router available:', this.$router)
  if (ownerId) {
    this.$router.push(`/public/${ownerId}`)
  }
}
  },
  computed: {
    displayedItems() {
      if (this.limit && this.menuItems.length > this.limit) {
        return this.menuItems.slice(0, this.limit);
      }
      return this.menuItems;
    }
  },
  async created() {
    try {
      const endpoint = this.ownerId
        ? `/menu/public/${this.ownerId}`
        : '/menu/public/unknown';

      const { data } = await axios.get(endpoint);
      this.menuItems = Array.isArray(data) ? data : [];
    } catch (err) {
      this.error = err.response?.data?.message || 'Failed to load menu';
      console.error('Error loading menu:', err);
    } finally {
      this.loading = false;
    }
  },
  // Add this setup function to provide the router
  setup() {
    const router = useRouter();
    return { router };
  }
}
</script>

<style scoped>
.menu-container {
  padding: 2rem;
  background-color: #f8f9fa;
}

.card {
  border: 1px solid #FFC107;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: white; /* Gold background */
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  background-color: #FFD700;
  box-shadow: 5px 10px 1px 1px #2d333f;/* Slightly darker gold on hover */
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  width: 100%;
  border-bottom: 1px solid rgba(45, 51, 63, 0.1); /* Dark border */
}

.card-body {
  padding: 1.5rem;
  color: #2d333f; /* Dark text */
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #2d333f; /* Dark text */
}

.card-text {
  color: #2d333f; /* Dark text */
  font-size: 0.95rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.price {
  color: #2d333f; /* Dark text */
  font-weight: bold;
  font-size: 1.1rem;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.social-link a {
  color: #1358e3; /* Dark text */
  transition: color 0.2s;
  font-weight: 500;
}

.social-link a:hover {
  color: rgba(45, 51, 63, 0.8); /* Slightly transparent dark */
}

.empty-state {
  background-color: #FFD700; /* Gold background */
  border-radius: 12px;
  color: #2d333f; /* Dark text */
}
.btn-view-menu {

  background-color: #333;
  color: #FFD700;
  border: none;
  padding: 8px 15px;
  margin-bottom: 40px;
  border-radius: 5px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-view-menu:hover {
  background-color: #555;
  color: #FFC107;
}
/* Responsive adjustments */
@media (max-width: 768px) {
  .menu-container {
    padding: 1rem;
  }

  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
