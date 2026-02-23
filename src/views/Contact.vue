<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">اتصل بنا</h2>
    <p class="text-center mb-4">
      يسعدنا سماع رأيك. سواء كان لديك استفسارات أو ملاحظات أو تحتاج إلى دعم، لا تتردد في التواصل معنا.
    </p>

    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card p-4 shadow-sm">
          <h5>البريد الإلكتروني</h5>
          <p>support@Ta3eem.com</p>

          <h5>الهاتف</h5>
          <p>+967 777 123 456</p>

          <h5>الموقع</h5>
          <p>صنعاء، اليمن</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contact'
}
</script>

<style scoped>
.container {
  direction: rtl;
  text-align: center;
  padding: 2rem;
}

h2 {
  font-family: 'Cairo', sans-serif;
  color: #333;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

p {
  font-family: 'Cairo', sans-serif;
  color: #666;
  line-height: 1.8;
}

.card {
  background-color: #f8f9fa;
  border: none;
  border-radius: 10px;
  text-align: right;
}

.card h5 {
  font-family: 'Cairo', sans-serif;
  color: #FFD700;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card p {
  font-family: 'Cairo', sans-serif;
  color: #333;
  margin-bottom: 1.5rem;
}
</style>
