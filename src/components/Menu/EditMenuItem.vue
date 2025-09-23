<template>
  <div class="edit-menu-item">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Edit Menu Item</h2>
      <router-link to="/dashboard" class="btn btn-outline-secondary">
        Back to Dashboard
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Name</label>
        <input v-model="form.name" type="text" class="form-control" required>
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="form.description" class="form-control" rows="3" required></textarea>
      </div>

      <div class="form-group">
        <label>Price ($)</label>
        <input v-model="form.price" type="number" min="0" step="0.01" class="form-control" required>
      </div>

      <div class="form-group">
        <label>Image URL</label>
        <input v-model="form.image" type="url" class="form-control">
        <small class="form-text text-muted">Leave blank to use default image</small>
      </div>

      <div class="form-group">
        <img v-if="form.image" :src="form.image" class="img-thumbnail preview-image">
      </div>

      <div class="form-group d-flex justify-content-between">
        <button type="submit" class="btn btn-primary">Save Changes</button>
        <button type="button" @click="handleDelete" class="btn btn-danger">Delete Item</button>
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
        console.error('Error:', error)
        alert(error.response?.data?.message || 'Failed to fetch menu item')
        this.$router.push('/dashboard')
      }
    },
    async handleSubmit() {
      try {
        await this.$http.put(`/menu/${this.$route.params.id}`, this.form)
        this.$router.push('/dashboard')
      } catch (error) {
        console.error('Error:', error)
        alert(error.response?.data?.message || 'Failed to fetch menu item')
      }
    },
    async handleDelete() {
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await this.$http.delete(`/menu/${this.$route.params.id}`)
          this.$router.push('/dashboard')
        } catch (error) {
          console.error('Error:', error)
          alert(error.response?.data?.message || 'Failed to fetch menu item')
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
</style>
