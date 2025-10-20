const dialog = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
const phone = document.getElementById('phone');
let lastActive = null;

// Открытие модалки
openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dialog.showModal();
    dialog.querySelector('input,select,textarea,button')?.focus();
});

// Закрытие модалки
closeBtn.addEventListener('click', () => dialog.close('cancel'));

// Восстановление фокуса после закрытия
dialog.addEventListener('close', () => {
    lastActive?.focus();
    if (dialog.returnValue === 'success') {
        alert('Спасибо за сообщение!');
    }
});

// Валидация формы
form?.addEventListener('submit', (e) => {
    // Сброс кастомных сообщений
    [...form.elements].forEach(el => el.setCustomValidity?.(''));

    // Проверка встроенных ограничений
    if (!form.checkValidity()) {
        e.preventDefault();

        // Таргетированное сообщение для email
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }

        form.reportValidity(); // Показать браузерные подсказки

        // A11y: подсветка проблемных полей
        [...form.elements].forEach(el => {
            if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
        });
        return;
    }

    // Успешная "отправка"
    e.preventDefault();
    dialog.close('success');
    form.reset();
});

// Лёгкая маска для телефона
phone?.addEventListener('input', () => {
    const digits = phone.value.replace(/\D/g, '').slice(0, 11); // до 11 цифр
    const d = digits.replace(/^8/, '7'); // нормализуем 8 → 7
    const parts = [];
    if (d.length > 0) parts.push('+7');
    if (d.length > 1) parts.push(' (' + d.slice(1, 4));
    if (d.length >= 4) parts[parts.length - 1] += ')';
    if (d.length >= 5) parts.push(' ' + d.slice(4, 7));
    if (d.length >= 8) parts.push('-' + d.slice(7, 9));
    if (d.length >= 10) parts.push('-' + d.slice(9, 11));
    phone.value = parts.join('');
});

// Переключатель темы
const KEY = 'theme', btn = document.querySelector('.theme-toggle');
const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
if (localStorage.getItem(KEY) === 'dark' || (!localStorage.getItem(KEY) && prefersDark)) {
    document.body.classList.add('theme-dark');
    btn?.setAttribute('aria-pressed', 'true');
}
btn?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('theme-dark');
    btn.setAttribute('aria-pressed', String(isDark));
    localStorage.setItem(KEY, isDark ? 'dark' : 'light');
});