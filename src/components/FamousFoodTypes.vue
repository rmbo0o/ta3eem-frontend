<template>

  <div class="hero-section">
    <div class="hero-content">
    <h2 class="mb-3 text-center">Famous Food Types</h2>
    <!-- Search and Filters -->
    <div class="row mb-4">
      <div class="col-md-6 mb-3">
        <input v-model="searchType" class="form-control" placeholder="Search food type (e.g., Mandi, Salad, Pizza)" />
      </div>
      <div class="col-md-3 mb-3">
        <input v-model.number="minPrice" class="form-control" placeholder="Min Price" />
      </div>
      <div class="col-md-3 mb-3">
        <input v-model.number="maxPrice" class="form-control" placeholder="Max Price" />
      </div>
    </div>


    <!-- Search and Clear Buttons -->
    <div class="d-flex justify-content-center mb-3">
      <button class="btn btn-primary me-2" @click="handleSearch">Search</button>
      <button class="btn btn-clear btn-outline-primary me-2" @click="clearFilters">Clear</button>
    </div>
    <div class="d-flex flex-wrap justify-content-center mb-4">
      <button
        v-for="type in popularTypes"
        :key="type"
        class="btn btn-outline-primary me-2 mb-2"
        @click="fetchFoodItems(type)">
        {{ type }}
      </button>
      <button
        class="btn btn-outline-primary mb-2"
        @click="fetchAllFoodItems">
        See All
      </button>
    </div>
    </div>
  </div>
  <div class="container mt-4">
    <!-- Popular Types -->


    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center mt-4">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Loading food items...</p>
    </div>

    <!-- No Results Found -->
    <!-- <div v-if="foodItems.length === 0 && !loading" class="text-center mt-4">
      <p class="text-muted">No food items found. Try another type or adjust the price range.</p>
    </div> -->

    <!-- Food Items List -->
    <div class="row">
      <div class="col-md-4 mb-4" v-for="item in foodItems" :key="item.id">
        <div class="card h-100 shadow-sm">
          <img :src="getImageUrl(item.image_url)" class="card-img-top" :alt="item.food_name" />
          <div class="card-body">
            <h5 class="card-title">{{ item.food_name }}</h5>
            <p class="card-text">{{ item.description }}</p>
            <p class="card-text"><strong>Price:</strong> {{ item.price }} USD</p>
            <p class="card-text">
              <strong>Owner:</strong>
              <a :href="item.owner_instagram" target="_blank">{{ item.owner_name }}</a>
            </p>
            <button class="btn btn-primary w-100" @click="viewOwnerMenu(item.owner_id)">
              View Full Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchType: "",
      minPrice: null,
      maxPrice: null,
      foodItems: [],
      loading: false,
      popularTypes: ["Mandi", "Salad", "Pizza", "Burger", "Pasta", "Drinks"],
      page: 1,
      limit: 1,
    };
  },
  methods: {
    async fetchFoodItems(type = "") {
      this.loading = true;
      const query = typeof type === "string" && type !== "" ? type.trim() : this.searchType.trim();

      let apiUrl = `https://ta3eem-backend.onrender.com/api/menu/food-items?type=${encodeURIComponent(query)}`;

      if (this.minPrice) apiUrl += `&minPrice=${this.minPrice}`;
      if (this.maxPrice) apiUrl += `&maxPrice=${this.maxPrice}`;

      try {
        const response = await axios.get(apiUrl);
        this.foodItems = response.data;
      } catch (error) {
        console.error("Error fetching food items:", error);
      } finally {
        this.loading = false;
      }
      window.scrollBy({
        top: 500,
        behavior: 'smooth'
      });
    },

    async fetchAllFoodItems() {
  this.loading = true;

  // Base URL without type filter
  let apiUrl = 'https://ta3eem-backend.onrender.com/api/menu/food-items';

  // Only add price filters if they exist
  const params = [];
  if (this.minPrice) params.push(`minPrice=${this.minPrice}`);
  if (this.maxPrice) params.push(`maxPrice=${this.maxPrice}`);

  // Append params if any exist
  if (params.length) {
    apiUrl += `?${params.join('&')}`;
  }

  try {
    const response = await axios.get(apiUrl);
    this.foodItems = response.data; // Store the actual response data
  } catch (error) {
    console.error("Error fetching all food items:", error);
    // You might want to set foodItems to empty array only on error
    this.foodItems = [];
  } finally {
    this.loading = false;
  }
  window.scrollBy({
        top: 500,
        behavior: 'smooth'
      });
},

    handleSearch() {
      // Simply call your existing fetch method without navigation
      if (this.searchType || this.minPrice || this.maxPrice) {
        this.fetchFoodItems();
      } else {
        this.fetchAllFoodItems();
      }
      window.scrollBy({
        top: 500,
        behavior: 'smooth'
      });
    },

    clearFilters() {
      this.searchType = "";
      this.minPrice = null;
      this.maxPrice = null;
       this.foodItems = [];
    },

    // Keep all your other existing methods unchanged
    viewOwnerMenu(ownerId) {
      if (ownerId) {
        this.$router.push(`/owner/${ownerId}/menu`);
      } else {
        console.error("Owner ID is missing for this item.");
      }
    },

    getImageUrl(imagePath) {
      if (imagePath.startsWith("http")) {
        return imagePath;
      }
      return `https://ta3eem-backend.onrender.com${imagePath}`;
    }
  },
  mounted() {
    // this.fetchAllFoodItems();
  }
};
</script>

<style scoped>
.container {
  max-width: 900px;
}
.hero-section {
  background-image: url('@/assets/background.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  height: 70vh;
  min-height: 600px;
  width: 100%;
  display: flex;
  align-items: center;
  text-align: left;
  position: relative;
  color: #fff;
  padding: 0 5%;
}

.hero-content {
  max-width: 600px;
  margin: 0;
  padding-top: 80px;
}

/* For the scrolled state */
.hero-section.scrolled {
  height: 40vh;
  min-height: 300px;
  transition: height 0.3s ease;
}

/* Updated Card Styles */
.card {
  transition: all 0.3s ease;
  border: none;
  background-color: white; /* Jambiya yellow */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #333; /* Dark text for contrast */
}

.card:hover {
  transform: translateY(-5px);
  background-color: #FFC107; /* Slightly darker yellow on hover */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #222;
}

.card-text {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.card-text strong {
  color: #222;
}

.btn-primary {
  background-color: #333;
  border-color: #333;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #555;
  border-color: #555;
}

/* Loading spinner */
.spinner-border.text-primary {
  color: #FFD700 !important;
}

/* Popular types buttons */
.btn-outline-primary {
  color: #333;
  border-color: #333;
}

.btn-outline-primary:hover {
  background-color: #333;
  color: #FFD700;
}

.btn-success {
  background-color: #28a745;
}
.btn-clear {
  height: 38px;
  width: 72px;
  margin-top: 15px;
}
/* Responsive adjustments */
@media (max-width: 768px) {
  .card {
    margin-bottom: 1.5rem;
  }
}
</style>
