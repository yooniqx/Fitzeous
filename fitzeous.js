/* =============================================
   FITZEOUS FITNESS — Shared JavaScript (fitzeous.js)
   ============================================= */

// ---- Hamburger Menu ----
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
  });

  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      closeMenu();
    }
  });
})();

function closeMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;
  mobileNav.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
}

// ---- Read More ----
function readMore() {
  alert('Full article coming soon. Contact us for more information.');
}

// ---- Contact Form Submit ----
function submitForm() {
  const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
  const labels = ['Name', 'Email', 'Phone', 'Query Topic', 'Message'];
  let isValid = true;
  const formData = {};

  inputs.forEach(function (input, index) {
    const value = input.value.trim();
    formData[labels[index] || ('Field ' + (index + 1))] = value;
    
    // Basic validation
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      input.style.borderColor = 'red';
    } else {
      input.style.borderColor = '';
    }
  });

  if (!isValid) {
    alert('Please fill in all required fields.');
    return;
  }

  // Show success message
  alert('Thank you for contacting us! We will get back to you soon.\n\nNote: This is a demo site. In production, this would send your message to our team.');
  
  // Log to console for demo purposes
  console.log('%c Fitzeous — Contact Form Submission ', 'background:#035503;color:white;font-weight:bold;padding:4px 8px;border-radius:3px;');
  console.table(formData);
  
  // Clear form
  inputs.forEach(function(input) {
    input.value = '';
  });
}