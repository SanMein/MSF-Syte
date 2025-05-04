document.addEventListener('DOMContentLoaded', () => {
    // Устанавливаем начальные состояния
    gsap.set('.logo', { opacity: 0, scale: 0.8 });
    gsap.set('.login-container', { opacity: 0 });
    gsap.set('.animate-heading', { opacity: 0, y: -20 });
    gsap.set('.animate-heading-bottom', { opacity: 0, y: 20 });
    gsap.set('.animate-text', { opacity: 0, x: -20 });
    gsap.set('.animate-btn', { opacity: 0, y: 20 });
    gsap.set('.animate-input-top', { opacity: 0, y: -20 });
    gsap.set('.animate-input-bottom', { opacity: 0, y: 20 });
    gsap.set('.animate-bounce', { opacity: 0, y: 10 });

    // Анимация логотипа
    gsap.to('.logo', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out'
    });

    // Анимация контейнеров
    gsap.to('.login-container', {
        opacity: 1,
        duration: 1,
        delay: 0.2,
        ease: 'power2.out',
        stagger: 0.2
    });

    // Анимация заголовков
    gsap.to('.animate-heading', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });

    gsap.to('.animate-heading-bottom', {
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

    // Анимация кнопок
    gsap.to('.animate-btn', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        delay: 0.6
    });

    // Анимация полей ввода
    gsap.to('.animate-input-top', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.4
    });

    gsap.to('.animate-input-bottom', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.4
    });

    // Анимация ссылок
    gsap.to('.animate-bounce', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 0.8
    });

    // Резервная видимость
    setTimeout(() => {
        document.querySelectorAll('.logo, .login-container, .animate-heading, .animate-heading-bottom, .animate-text, .animate-btn, .animate-input-top, .animate-input-bottom, .animate-bounce').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }, 2000);

    // Навигация и активная страница
    const links = document.querySelectorAll('.navbar a');
    const currentPage = window.location.pathname.split('/').pop();

    const activeLink = Array.from(links).find(link => link.getAttribute('href') === currentPage);
    if (currentPage === 'i-login.html') {
        document.getElementById('login-link').classList.add('active');
    }

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (window.location.pathname.split('/').pop() === href) {
                event.preventDefault();
            }
        });
    });

    // Ключ для шифрования (в реальном приложении должен быть безопасно передан)
    const ENCRYPTION_KEY = 'msf043-secret-key';

    // Функции шифрования и дешифрования
    function encryptData(data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
    }

    function decryptData(encryptedData) {
        const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    // Функция отображения уведомлений
    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.remove('hidden');

        gsap.fromTo(notification,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );

        setTimeout(() => {
            gsap.to(notification, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => {
                    notification.classList.add('hidden');
                    notification.textContent = '';
                }
            });
        }, 3000);
    }

    // Переключение форм
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const registerSwitch = document.getElementById('register-switch');
    const loginSwitch = document.getElementById('login-switch');

    if (registerSwitch && loginSwitch) {
        registerSwitch.addEventListener('click', (event) => {
            event.preventDefault();
            loginContainer.classList.add('hidden');
            registerContainer.classList.remove('hidden');
            gsap.fromTo(registerContainer, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
        });

        loginSwitch.addEventListener('click', (event) => {
            event.preventDefault();
            registerContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
            gsap.fromTo(loginContainer, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
        });
    }

    // Загрузка зашифрованных данных из localStorage
    let users = [];
    const encryptedUsers = localStorage.getItem('users');
    if (encryptedUsers) {
        try {
            users = decryptData(encryptedUsers);
        } catch (e) {
            showNotification('Ошибка при дешифровании данных пользователей.');
            users = [];
        }
    }

    // Обработка формы входа
    document.getElementById('login-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const login = document.querySelector('#login-form input[type="text"]').value.trim();
        const password = document.querySelector('#login-form input[type="password"]').value.trim();

        const user = users.find(user => user.login === login && user.password === password);

        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', encryptData(user));
            localStorage.setItem('accessLevel', 'δέлта (Дельта)');
            window.location.href = "personal-account.html";
        } else {
            showNotification("Такой логин не зарегистрирован.");
        }
    });

    // Обработка формы регистрации
    document.getElementById('register-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const newLogin = document.querySelector('#register-form input[type="text"]').value.trim();
        const newPassword = document.querySelector('#register-form input[type="password"]').value.trim();

        const existingUser = users.find(user => user.login === newLogin);

        if (existingUser) {
            showNotification("Такой логин уже зарегистрирован.");
        } else {
            const newUser = {
                login: newLogin,
                password: newPassword,
                registrationDate: new Date().toISOString(),
                accessLevel: 'δέлта (Дельта)'
            };
            users.push(newUser);
            localStorage.setItem('users', encryptData(users));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', encryptData(newUser));
            localStorage.setItem('accessLevel', 'δέлта (Дельта)');
            window.location.href = "personal-account.html";
        }
    });

    // Проверка уровня доступа с подтверждением через Enter
    const accessCodeInput = document.getElementById('access-code');
    const accessStatus = document.getElementById('access-status');
    const accessLevelDisplay = document.getElementById('access-level-display');

    accessCodeInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const code = accessCodeInput.value.trim();
            accessStatus.innerHTML = '';
            accessLevelDisplay.innerHTML = '';
            let accessLevel = '';
            let color = '';
            let redirect = false;

            switch (code) {
                case 'ALPHAC-781296540128399317460325120458-GENCOM':
                    accessLevel = 'ἄлфа (Альфа)';
                    color = 'red';
                    redirect = true;
                    break;
                case 'BETACX-042918637561290837465120934576-CMDOPS':
                    accessLevel = 'βῆта (Бета)';
                    color = 'blue';
                    redirect = true;
                    break;
                case 'GAMMAC-917230485619827364012398172034-TACOPS':
                    accessLevel = 'γάμμα (Гамма)';
                    color = 'green';
                    redirect = true;
                    break;
                case 'DELINI-908476352819374602185934761209-SUPENG':
                    accessLevel = 'δέлта (Дельта)';
                    color = 'yellow';
                    redirect = true;
                    break;
                default:
                    return;
            }

            accessStatus.innerHTML = `Уровень допуска: ${accessLevel} // Статус: Подключён`;
            accessLevelDisplay.innerHTML = `Уровень доступа: ${accessLevel} // Статус: Подключено`;
            accessLevelDisplay.style.color = color;

            if (redirect) {
                localStorage.setItem('accessLevel', accessLevel);
                fetch('personal-account.html')
                    .then(response => {
                        if (response.ok) {
                            window.location.href = 'personal-account.html';
                        } else {
                            showNotification('Страница personal-account.html не найдена.');
                        }
                    })
                    .catch(error => {
                        showNotification('Ошибка при доступе к personal-account.html.');
                    });
            }
        }
    });

    // Сбрасываем уровень доступа на δέлта (Дельта) при перезагрузке страницы
    window.addEventListener('load', () => {
        localStorage.setItem('accessLevel', 'δέлта (Дельта)');
    });
});
