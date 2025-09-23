<template>
  <div class="menu-form">
    <h2>Add New Menu Item</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Name</label>
        <input v-model="form.name" type="text" class="form-control" required>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="form.description" class="form-control" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>Price</label>
        <input v-model="form.price" type="number" step="0.01" class="form-control" required>
      </div>
      <div class="form-group">
        <label>Image URL</label>
        <input v-model="form.image" type="url" class="form-control">
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
      <router-link to="/dashboard" class="btn btn-link">Cancel</router-link>
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
        console.error('Error:', error)
        alert(error.response?.data?.message || 'Failed to fetch menu item')
      }
    }
  }
}
</script>
