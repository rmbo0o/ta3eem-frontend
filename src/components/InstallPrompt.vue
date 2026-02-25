<template>
  <div v-if="showPrompt" class="install-prompt">
    <div class="prompt-content">
      <img src="/icon-512x512.png" alt="طعيم" class="prompt-icon">
      <div class="prompt-text">
        <h3>ثبّت تطبيق طعيم</h3>
        <p>حمّل التطبيق على جهازك لاستخدام أسرع</p>
      </div>
      <div class="prompt-buttons">
        <button @click="installApp" class="install-btn">
          <i class="fas fa-download"></i> تثبيت
        </button>
        <button @click="dismissPrompt" class="later-btn">لاحقاً</button>
      </div>
      <button @click="dismissPrompt" class="close-btn">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const showPrompt = ref(false)
    const deferredPrompt = ref(null)

    onMounted(() => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return
      }

      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt.value = e
        setTimeout(() => {
          showPrompt.value = true
        }, 3000)
      })
    })

    const installApp = async () => {
      if (!deferredPrompt.value) return
      deferredPrompt.value.prompt()
      await deferredPrompt.value.userChoice
      deferredPrompt.value = null
      showPrompt.value = false
    }

    const dismissPrompt = () => {
      showPrompt.value = false
    }

    return {
      showPrompt,
      installApp,
      dismissPrompt
    }
  }
}
</script>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: 90%;
  max-width: 400px;
  direction: rtl;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.prompt-content {
  background-color: #2d333f;
  border: 2px solid #FFD700;
  border-radius: 15px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.prompt-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
}

.prompt-text {
  flex: 1;
}

.prompt-text h3 {
  color: #FFD700;
  margin: 0 0 3px 0;
  font-size: 1rem;
}

.prompt-text p {
  color: #e0e0e0;
  margin: 0;
  font-size: 0.8rem;
}

.prompt-buttons {
  display: flex;
  gap: 5px;
}

.install-btn {
  background-color: #FFD700;
  color: #2d333f;
  border: none;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Noto Sans Arabic', sans-serif;
  font-size: 0.85rem;
}

.later-btn {
  background-color: transparent;
  color: #999;
  border: 1px solid #999;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-family: 'Noto Sans Arabic', sans-serif;
  font-size: 0.85rem;
}

.close-btn {
  position: absolute;
  top: -8px;
  left: -8px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
}

@media (max-width: 480px) {
  .prompt-content {
    flex-wrap: wrap;
  }
  .prompt-buttons {
    width: 100%;
    justify-content: center;
  }
}
</style>
