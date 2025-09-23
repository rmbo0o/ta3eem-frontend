<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- About Section -->
        <div class="footer-section">
          <h5 class="footer-heading">About Ta3eem</h5>
          <p class="footer-text">
            Discover the best local restaurants and food experiences in your area.
          </p>
          <div class="social-icons">
            <a href="#" class="social-icon">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-twitter"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h5 class="footer-heading">Quick Links</h5>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/menu">Menu</router-link></li>
            <li><router-link to="/owners">Owners</router-link></li>
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section">
          <h5 class="footer-heading">Contact Us</h5>
          <ul class="contact-info">
            <li><i class="fas fa-map-marker-alt"></i> 123 Foodie Street, City</li>
            <li><i class="fas fa-phone"></i> +1 (123) 456-7890</li>
            <li><i class="fas fa-envelope"></i> info@foodie.com</li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="footer-section">
          <h5 class="footer-heading">Newsletter</h5>
          <p class="footer-text">Subscribe to get updates on new restaurants and special offers.</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Your email address" class="newsletter-input">
            <button class="newsletter-btn">Subscribe</button>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">&copy; {{ currentYear }} Foodie. All rights reserved.</p>
        <!-- <div class="legal-links">
          <router-link to="/privacy">Privacy Policy</router-link>
          <router-link to="/terms">Terms of Service</router-link>
        </div> -->
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.site-footer {
  background-color: #2d333f;
  color: #fff;
  padding: 3rem 0 0;
  margin-top: 3rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section {
  margin-bottom: 1.5rem;
}

.footer-heading {
  color: #FFD700;
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-heading::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 2px;
  background-color: #FFD700;
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #FFD700;
}

.contact-info {
  list-style: none;
  padding: 0;
}

.contact-info li {
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.contact-info i {
  color: #FFD700;
  margin-right: 0.8rem;
  width: 20px;
  text-align: center;
}

.social-icons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;


}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  border-radius: 50%;
  transition: all 0.3s;
  text-decoration: none;
}

.social-icon:hover {
  background-color: #FFD700;
  color: #2d333f;
}

.newsletter-form {
  display: flex;
  margin-top: 1rem;
}

.newsletter-input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 4px 0 0 4px;
  font-size: 0.9rem;
}

.newsletter-btn {
  background-color: #FFD700;
  color: #2d333f;
  border: none;
  padding: 0 1.2rem;
  font-weight: 600;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.newsletter-btn:hover {
  background-color: #FFC107;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.copyright {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.5rem;
}

.legal-links {
  display: flex;
  gap: 1rem;
}

.legal-links a {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.legal-links a:hover {
  color: #FFD700;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-input {
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  .newsletter-btn {
    border-radius: 4px;
    padding: 0.6rem;
  }
}
</style>
