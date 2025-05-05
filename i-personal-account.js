document.addEventListener('DOMContentLoaded', () => {
    // Устанавливаем начальные состояния
    gsap.set('.avatar', { opacity: 0, scale: 0.8 });
    gsap.set('.personal-container', { opacity: 0 });
    gsap.set('.animate-heading', { opacity: 0, y: -20 });
    gsap.set('.animate-text', { opacity: 0, x: -20 });
    gsap.set('.animate-btn', { opacity: 0, y: 20 });
    gsap.set('.animate-input-top', { opacity: 0, y: -20 });
    gsap.set('.animate-input-bottom', { opacity: 0, y: 20 });

    // Анимация аватарки
    gsap.to('.avatar', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out'
    });

    // Анимация контейнеров
    gsap.to('.personal-container', {
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

    // Резервная видимость
    setTimeout(() => {
        document.querySelectorAll('.avatar, .personal-container, .animate-heading, .animate-text, .animate-btn, .animate-input-top, .animate-input-bottom').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }, 2000);

    // Навигация
    const links = document.querySelectorAll('.navbar a');
    const currentPage = window.location.pathname.split('/').pop();
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

    // Ключ для шифрования
    const ENCRYPTION_KEY = 'msf043-secret-key';

    // Функции шифрования и дешифрования
    function encryptData(data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
    }

    function decryptData(encryptedData) {
        const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    // Проверка валидности зашифрованных данных
    function isValidEncryptedData(data) {
        if (!data || typeof data !== 'string') return false;
        try {
            const bytes = CryptoJS.AES.decrypt(data, ENCRYPTION_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            JSON.parse(decrypted);
            return true;
        } catch (e) {
            return false;
        }
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

    // Проверка авторизации
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'i-login.html';
        return;
    }

    // Загрузка данных пользователя
    let currentUser = {};
    const encryptedUser = localStorage.getItem('currentUser');
    if (encryptedUser && isValidEncryptedData(encryptedUser)) {
        try {
            currentUser = decryptData(encryptedUser);
        } catch (e) {
            console.error('Ошибка дешифрования пользователя:', e);
            localStorage.removeItem('currentUser');
            window.location.href = 'i-login.html';
            return;
        }
    } else {
        window.location.href = 'i-login.html';
        return;
    }

    // Отображение данных профиля
    document.getElementById('profile-login').textContent = currentUser.login || 'Неизвестно';
    document.getElementById('profile-password').textContent = currentUser.password || '********';
    document.getElementById('profile-date').textContent = new Date(currentUser.registrationDate).toLocaleDateString('ru-RU') || 'Неизвестно';
    document.getElementById('profile-access').textContent = currentUser.accessLevel || 'δέлτα (Дельта)';
    document.getElementById('profile-audit').textContent = currentUser.audit || 'AUDIT-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    document.getElementById('profile-code').textContent = currentUser.code || 'CODE-' + Math.random().toString(36).substr(2, 8).toUpperCase();

    // Отображение аватарки
    const avatar = document.getElementById('user-avatar');
    if (currentUser.avatar) {
        avatar.src = currentUser.avatar;
    }

    // Отображение уровня доступа
    const accessLevelDisplay = document.getElementById('access-level-display');
    accessLevelDisplay.textContent = `Уровень доступа: ${currentUser.accessLevel || 'δέлτα (Дельта)'} // Статус: Подключено`;
    accessLevelDisplay.style.color = currentUser.accessLevel.includes('ἄлφα') ? 'red' :
                                    currentUser.accessLevel.includes('βῆτα') ? 'blue' :
                                    currentUser.accessLevel.includes('γάμμα') ? 'green' : 'yellow';

    // Уведомление при входе
    if (localStorage.getItem('isFreshLogin') === 'true') {
        showNotification('Добро пожаловать в личный кабинет');
        localStorage.removeItem('isFreshLogin');
    }

    // Кнопка выхода
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('accessLevel');
        window.location.href = 'i-login.html';
    });

    // Переключение на форму редактирования
    const personalContainer = document.getElementById('personal-container');
    const editContainer = document.getElementById('edit-container');
    document.getElementById('edit-profile-btn').addEventListener('click', () => {
        personalContainer.classList.add('hidden');
        editContainer.classList.remove('hidden');
        document.getElementById('edit-login').value = currentUser.login || '';
        document.getElementById('edit-password').value = currentUser.password || '';
        document.getElementById('edit-audit').value = currentUser.audit || document.getElementById('profile-audit').textContent;
        document.getElementById('edit-code').value = currentUser.code || document.getElementById('profile-code').textContent;
        gsap.fromTo(editContainer, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    });

    // Обработка формы редактирования
    document.getElementById('edit-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const newLogin = document.getElementById('edit-login').value.trim();
        const newPassword = document.getElementById('edit-password').value.trim();
        const newAudit = document.getElementById('edit-audit').value.trim();
        const newCode = document.getElementById('edit-code').value.trim();
        const avatarInput = document.getElementById('edit-avatar');

        // Загрузка аватарки
        let newAvatar = currentUser.avatar;
        if (avatarInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                newAvatar = e.target.result;
                updateUserData(newLogin, newPassword, newAudit, newCode, newAvatar);
            };
            reader.readAsDataURL(avatarInput.files[0]);
        } else {
            updateUserData(newLogin, newPassword, newAudit, newCode, newAvatar);
        }
    });

    // Функция обновления данных пользователя
    function updateUserData(login, password, audit, code, avatar) {
        let users = [];
        const encryptedUsers = localStorage.getItem('users');
        if (encryptedUsers && isValidEncryptedData(encryptedUsers)) {
            try {
                users = decryptData(encryptedUsers);
            } catch (e) {
                console.error('Ошибка дешифрования:', e);
                users = [];
            }
        }

        const existingUser = users.find(user => user.login === login && user.login !== currentUser.login);
        if (existingUser) {
            showNotification('Такой логин уже зарегистрирован.');
            return;
        }

        const updatedUser = {
            login,
            password,
            registrationDate: currentUser.registrationDate,
            accessLevel: currentUser.accessLevel,
            audit,
            code,
            avatar
        };

        users = users.map(user => user.login === currentUser.login ? updatedUser : user);
        localStorage.setItem('users', encryptData(users));
        localStorage.setItem('currentUser', encryptData(updatedUser));

        // Обновление отображения
        currentUser = updatedUser;
        document.getElementById('profile-login').textContent = login;
        document.getElementById('profile-password').textContent = password;
        document.getElementById('profile-audit').textContent = audit;
        document.getElementById('profile-code').textContent = code;
        if (avatar) {
            document.getElementById('user-avatar').src = avatar;
        }

        // Переключение обратно
        editContainer.classList.add('hidden');
        personalContainer.classList.remove('hidden');
        gsap.fromTo(personalContainer, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
        showNotification('Профиль успешно обновлён');
    }
});