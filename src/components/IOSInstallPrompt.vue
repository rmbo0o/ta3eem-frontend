<template>
  <div v-if="showIOSPrompt && isIOS" class="ios-install-prompt">
    <div class="ios-prompt-content">
      <div class="ios-prompt-header">
        <img src="/icon-512x512.png" alt="طعم" class="ios-prompt-icon">
        <h3>تثبيت تطبيق طعم</h3>
        <button @click="dismissIOSPrompt" class="ios-close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <p>لتحميل التطبيق على جهاز iPhone الخاص بك:</p>
      <ol class="ios-instructions">
        <li>
          <i class="fas fa-share-alt"></i>
          <span>اضغط على زر المشاركة <strong>📤</strong> في الأسفل</span>
        </li>
        <li>
          <i class="fas fa-plus-circle"></i>
          <span>اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong></span>
        </li>
        <li>
          <i class="fas fa-check-circle"></i>
          <span>اضغط على <strong>"إضافة"</strong> في الأعلى</span>
        </li>
      </ol>
      <div class="ios-prompt-footer">
        <button @click="dismissIOSPrompt" class="ios-later-btn">تذكيري لاحقاً</button>
        <button @click="dismissForever" class="ios-dismiss-btn">لا تظهر مرة أخرى</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const showIOSPrompt = ref(false)
    const isIOS = ref(false)

    onMounted(() => {
      // Check if device is iPhone/iPad
      const ua = window.navigator.userAgent
      isIOS.value = /iPad|iPhone|iPod/.test(ua) && !window.MSStream

      // Check if already installed as PWA
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches

      // Check if user dismissed forever
      const dismissedForever = localStorage.getItem('iosPromptDismissed')

      if (isIOS.value && !isStandalone && !dismissedForever) {
        // Show prompt after 3 seconds
        setTimeout(() => {
          showIOSPrompt.value = true
        }, 3000)
      }
    })

    const dismissIOSPrompt = () => {
      showIOSPrompt.value = false
    }

    const dismissForever = () => {
      localStorage.setItem('iosPromptDismissed', 'true')
      showIOSPrompt.value = false
    }

    return {
      showIOSPrompt,
      isIOS,
      dismissIOSPrompt,
      dismissForever
    }
  }
}
</script>

<style scoped>
.ios-install-prompt {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  direction: rtl;
  padding: 20px;
}

.ios-prompt-content {
  background-color: #2d333f;
  border: 2px solid #FFD700;
  border-radius: 20px;
  padding: 25px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ios-prompt-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  position: relative;
}

.ios-prompt-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
}

.ios-prompt-header h3 {
  color: #FFD700;
  margin: 0;
  flex: 1;
  font-size: 1.2rem;
}

.ios-close-btn {
  background: transparent;
  border: none;
  color: #999;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
}

.ios-close-btn:hover {
  color: #fff;
}

.ios-prompt-content p {
  color: #e0e0e0;
  margin-bottom: 20px;
  font-size: 1rem;
}

.ios-instructions {
  list-style: none;
  padding: 0;
  margin: 0 0 25px 0;
}

.ios-instructions li {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background-color: rgba(255, 215, 0, 0.1);
  border-radius: 10px;
  margin-bottom: 10px;
  color: white;
}

.ios-instructions li i {
  color: #FFD700;
  width: 24px;
  font-size: 1.2rem;
  text-align: center;
}

.ios-instructions li span {
  flex: 1;
  font-size: 0.95rem;
}

.ios-instructions li strong {
  color: #FFD700;
}

.ios-prompt-footer {
  display: flex;
  gap: 10px;
}

.ios-later-btn {
  flex: 1;
  background-color: transparent;
  color: #999;
  border: 1px solid #999;
  padding: 12px;
  border-radius: 10px;
  font-family: 'Noto Sans Arabic', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ios-later-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.ios-dismiss-btn {
  flex: 1;
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-family: 'Noto Sans Arabic', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ios-dismiss-btn:hover {
  background-color: #c82333;
}

@media (max-width: 480px) {
  .ios-prompt-content {
    padding: 20px;
  }

  .ios-prompt-footer {
    flex-direction: column;
  }
}
</style>
