<template>
  <div class="form-group">
    <textarea
      v-model="response"
      class="form-control"
      placeholder="اكتب ردك هنا..."
      rows="3"
      required
    ></textarea>
    <button @click="submitResponse" class="btn btn-primary mt-2">إرسال الرد</button>
  </div>
</template>

<script>
import axios from '@/utils/api';

export default {
  props: ['reviewId'],
  data() {
    return {
      response: ''
    };
  },
  methods: {
    async submitResponse() {
      const token = localStorage.getItem('token');
      if (!this.response.trim()) {
        alert('الرجاء كتابة الرد');
        return;
      }

      try {
        const response = await axios.put(
          `https://ta3eem-backend.onrender.com/api/reviews/${this.reviewId}`,
          { response_text: this.response },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('تم إضافة الرد:', response.data);
        this.response = '';
        this.$emit('response-submitted');
        alert('تم إرسال الرد بنجاح');
      } catch (error) {
        console.error('خطأ في إرسال الرد:', error);
        alert(error.response?.data?.message || 'فشل إرسال الرد');
      }
    }
  }
};
</script>

<style scoped>
.form-group {
  text-align: right;
  direction: rtl;
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
</style>
