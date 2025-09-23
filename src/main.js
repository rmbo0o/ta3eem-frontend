import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from '@/utils/api'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/main.css'
import './assets/css/auth.css'
import './assets/css/menu.css'

// Configure axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://ta3eem-backend.onrender.com'

const app = createApp(App)

// Make axios available globally (optional)
app.config.globalProperties.$http = axios

app.use(createPinia())
app.use(router)
app.mount('#app')
