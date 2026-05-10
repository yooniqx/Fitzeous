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

// ---- Contact Form Submit — logs to browser console ----
function submitForm() {
  const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
  const labels = ['Name', 'Email', 'Phone', 'Query Topic', 'Message'];
  const formData = {};

  inputs.forEach(function (input, index) {
    formData[labels[index] || ('Field ' + (index + 1))] = input.value.trim();
  });

  const confirmed = window.confirm('Are you sure you want to submit?');
  if (confirmed) {
    console.log('%c Fitzeous — New Query Submission ', 'background:#035503;color:white;font-weight:bold;padding:4px 8px;border-radius:3px;');
    console.table(formData);
  }
}

// ---- Signup Form Submit — logs to browser console ----
function submitSignup() {
  const formData = {
    'Name':              document.getElementById('su-name')   ? document.getElementById('su-name').value.trim()   : '',
    'Email':             document.getElementById('su-email')  ? document.getElementById('su-email').value.trim()  : '',
    'Phone':             document.getElementById('su-phone')  ? document.getElementById('su-phone').value.trim()  : '',
    'Age Group':         document.getElementById('su-age')    ? document.getElementById('su-age').value           : '',
    'Gender':            (function(){ const g = document.querySelector('input[name="gender"]:checked'); return g ? g.value : 'Not selected'; })(),
    'How they heard':    document.getElementById('su-source') ? document.getElementById('su-source').value.trim() : '',
    'Message':           document.getElementById('su-msg')    ? document.getElementById('su-msg').value.trim()    : ''
  };

  const confirmed = window.confirm('Confirm submission?');
  if (confirmed) {
    console.log('%c Fitzeous -- New Member Registration ', 'background:#035503;color:white;font-weight:bold;padding:4px 8px;border-radius:3px;');
    console.table(formData);
  }
}