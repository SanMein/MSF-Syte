document.addEventListener('DOMContentLoaded', () => {
    // GSAP Animations
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // Initial state
    gsap.set('.navbar', { y: -100 });
    gsap.set('.logo', { scale: 0.8, opacity: 0 });
    gsap.set('.main-title', { y: 20, opacity: 0 });
    gsap.set('.sub-title', { y: 20, opacity: 0 });
    gsap.set('.card', { y: 50, opacity: 0 });
    gsap.set('.terminal-status', { opacity: 0 });

    // Sequence of animations
    tl.to('.navbar', { y: 0, duration: 0.5 })
      .to('.logo', { scale: 1, opacity: 1, duration: 0.8 }, '-=0.3')
      .to('.main-title', { y: 0, opacity: 1, duration: 1 }, '-=0.5')
      .to('.sub-title', { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
      .to('.card', { y: 0, opacity: 1, stagger: 0.3, duration: 1 }, '-=0.5')
      .to('.terminal-status', { opacity: 1, duration: 0.5 }, '-=0.5');

    // Link highlighting
    const links = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'i-structure.html';

    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
        link.addEventListener('click', (event) => {
            if (link.getAttribute('href') === currentPage) {
                event.preventDefault();
            }
        });
    });

    // Login link logic
    const loginLink = document.getElementById('login-link');
    if (localStorage.getItem('isLoggedIn') === 'true') {
        loginLink.textContent = 'ЛИЧНЫЙ КАБИНЕТ';
        loginLink.setAttribute('href', 'i-personal-account.html');
    }
});