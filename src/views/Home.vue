<template>
  <div>
    <div>
      <FamousFoodTypes />
    </div>
    <CategoryCards />
    <div class="container mt-4">
    
      <!-- Include Featured Profiles Component -->
      <FeaturedProfiles />
    </div>
    <Footer />
  </div>
</template>

<script>
import FamousFoodTypes from '@/components/FamousFoodTypes.vue'
import FeaturedProfiles from '@/components/FeaturedProfiles.vue'
import CategoryCards from '@/components/CategoryCards.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'HomeView',
  components: {
    FamousFoodTypes,
    FeaturedProfiles,
    CategoryCards,
    Footer,
  },
}
</script>
