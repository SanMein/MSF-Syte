document.addEventListener('DOMContentLoaded', () => {
    // Устанавливаем начальные состояния
    gsap.set('.logo', { opacity: 0, scale: 0.8 });
    gsap.set('.container', { opacity: 0 });
    gsap.set('.animate-heading', { opacity: 0, y: -20 });
    gsap.set('.animate-text', { opacity: 0, x: -20 });
    gsap.set('.animate-bounce', { opacity: 0, y: 20 });

    // Анимация логотипа
    gsap.to('.logo', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out'
    });

    // Анимация контейнера
    gsap.to('.container', {
        opacity: 1,
        duration: 1,
        delay: 0.2,
        ease: 'power2.out'
    });

    // Анимация заголовков
    gsap.to('.animate-heading', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Анимация текста
    gsap.to('.animate-text', {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.4
    });

    // Анимация ссылок с классом animate-bounce
    gsap.to('.animate-bounce', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.6
    });

    // Резервная видимость
    setTimeout(() => {
        document.querySelectorAll('.logo, .container, .animate-heading, .animate-text, .animate-bounce').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }, 2000);

    // Навигация и активная страница
    const links = document.querySelectorAll('.navbar a');
    const currentPage = window.location.pathname.split('/').pop() || 'i-contacts.html';

    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
        link.addEventListener('click', (event) => {
            if (window.location.pathname.split('/').pop() === link.getAttribute('href')) {
                event.preventDefault();
            }
        });
    });

    // Замена пункта навигации
    const loginLink = document.getElementById('login-link');
    if (localStorage.getItem('isLoggedIn') === 'true') {
        loginLink.textContent = 'ЛИЧНЫЙ КАБИНЕТ';
        loginLink.setAttribute('href', 'i-personal-account.html');
    }
});