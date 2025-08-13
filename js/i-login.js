document.addEventListener('DOMContentLoaded', () => {
    // GSAP Animations
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // Initial state
    gsap.set('.navbar', { y: -100 });
    gsap.set('.logo', { scale: 0.8, opacity: 0 });
    gsap.set('.card', { y: 50, opacity: 0 });
    gsap.set('.animate-heading', { y: 20, opacity: 0 });
    gsap.set('.animate-input-top', { y: 20, opacity: 0 });
    gsap.set('.animate-input-bottom', { y: 20, opacity: 0 });
    gsap.set('.animate-btn', { y: 20, opacity: 0 });
    gsap.set('.animate-text', { y: 20, opacity: 0 });
    gsap.set('.animate-bounce', { y: 20, opacity: 0 });
    gsap.set('.terminal-status', { opacity: 0 });

    // Sequence of animations
    tl.to('.navbar', { y: 0, duration: 0.5 })
      .to('.logo', { scale: 1, opacity: 1, duration: 0.8 }, '-=0.3')
      .to('.card', { y: 0, opacity: 1, stagger: 0.3, duration: 1 }, '-=0.5')
      .to('.animate-heading', { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
      .to('.animate-input-top', { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .to('.animate-input-bottom', { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .to('.animate-btn', { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .to('.animate-text', { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .to('.animate-bounce', { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .to('.terminal-status', { opacity: 1, duration: 0.5 }, '-=0.5');

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
    function showNotification(message, type = 'error') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;

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
    if (encryptedUsers && isValidEncryptedData(encryptedUsers)) {
        try {
            users = decryptData(encryptedUsers);
        } catch (e) {
            console.error('Ошибка дешифрования:', e);
            localStorage.removeItem('users');
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
            localStorage.setItem('accessLevel', 'δέлτα (Дельта)');
            window.location.href = "./src/i-personal-account.html";
        } else {
            showNotification("Неверный логин или пароль.");
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
                accessLevel: 'δέлτα (Дельта)'
            };
            users.push(newUser);
            localStorage.setItem('users', encryptData(users));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', encryptData(newUser));
            localStorage.setItem('accessLevel', 'δέлта (Дельта)');
            window.location.href = "./src/i-personal-account.html";
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
                    showNotification('Неверный код доступа.');
                    return;
            }

            accessStatus.innerHTML = `Уровень допуска: ${accessLevel} // Статус: Подключён`;
            accessLevelDisplay.innerHTML = `Уровень доступа: ${accessLevel} // Статус: Подключено`;
            accessLevelDisplay.style.color = color;

            if (redirect) {
                localStorage.setItem('accessLevel', accessLevel);
                window.location.href = './src/i-personal-account.html';
            }
        }
    });
});