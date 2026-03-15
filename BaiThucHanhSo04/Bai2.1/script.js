const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const displayName = document.getElementById('displayName');

function showError(fieldId, message) {
    const inputField = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}-error`);
    if (inputField && inputField.type !== 'radio') {
        inputField.classList.add('invalid');
    }
    errorSpan.innerText = message;
}

function clearError(fieldId) {
    const inputField = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}-error`);
    if (inputField) {
        inputField.classList.remove('invalid');
    }
    errorSpan.innerText = '';
}

function validateFullname() {
    const val = document.getElementById('fullname').value.trim();
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]{3,}$/;

    if (val === '') {
        showError('fullname', 'Họ tên không được để trống');
        return false;
    } else if (!nameRegex.test(val)) {
        showError('fullname', 'Họ tên ít nhất 3 ký tự, chỉ chứa chữ cái');
        return false;
    }
    clearError('fullname');
    return true;
}

function validateEmail() {
    const val = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (val === '') {
        showError('email', 'Email không được để trống');
        return false;
    } else if (!emailRegex.test(val)) {
        showError('email', 'Email không đúng định dạng (name@domain.com)');
        return false;
    }
    clearError('email');
    return true;
}

function validatePhone() {
    const val = document.getElementById('phone').value.trim();
    const phoneRegex = /^0\d{9}$/;

    if (val === '') {
        showError('phone', 'Số điện thoại không được để trống');
        return false;
    } else if (!phoneRegex.test(val)) {
        showError('phone', 'SĐT phải có 10 chữ số và bắt đầu bằng số 0');
        return false;
    }
    clearError('phone');
    return true;
}

function validatePassword() {
    const val = document.getElementById('password').value;
    // Ít nhất 8 ký tự, 1 hoa, 1 thường, 1 số
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (val === '') {
        showError('password', 'Mật khẩu không được để trống');
        return false;
    } else if (!passRegex.test(val)) {
        showError('password', 'Mật khẩu yếu (8+ ký tự, đủ chữ Hoa, thường, số)');
        return false;
    }
    clearError('password');
    return true;
}

function validateConfirmPassword() {
    const pass = document.getElementById('password').value;
    const confirmPass = document.getElementById('confirmPassword').value;

    if (confirmPass === '') {
        showError('confirmPassword', 'Vui lòng xác nhận mật khẩu');
        return false;
    } else if (confirmPass !== pass) {
        showError('confirmPassword', 'Mật khẩu xác nhận không khớp');
        return false;
    }
    clearError('confirmPassword');
    return true;
}

function validateGender() {
    const genderOptions = document.getElementsByName('gender');
    let isChecked = false;
    for (const opt of genderOptions) {
        if (opt.checked) isChecked = true;
    }

    if (!isChecked) {
        showError('gender', 'Vui lòng chọn giới tính');
        return false;
    }
    clearError('gender');
    return true;
}

function validateTerms() {
    const terms = document.getElementById('terms');
    if (!terms.checked) {
        showError('terms', 'Bạn phải đồng ý với điều khoản');
        return false;
    }
    clearError('terms');
    return true;
}

const fields = [
    { id: 'fullname', validate: validateFullname },
    { id: 'email', validate: validateEmail },
    { id: 'phone', validate: validatePhone },
    { id: 'password', validate: validatePassword },
    { id: 'confirmPassword', validate: validateConfirmPassword },
    { id: 'terms', validate: validateTerms }
];

fields.forEach(field => {
    const element = document.getElementById(field.id);

    element.addEventListener('blur', field.validate);
    element.addEventListener('input', () => {
        clearError(field.id);
    });
});

document.getElementsByName('gender').forEach(radio => {
    radio.addEventListener('change', validateGender);
});

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const isFullnameValid = validateFullname();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    const isGenderValid = validateGender();
    const isTermsValid = validateTerms();

    if (isFullnameValid && isEmailValid && isPhoneValid &&
        isPasswordValid && isConfirmValid && isGenderValid && isTermsValid) {
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
        displayName.innerText = document.getElementById('fullname').value;
    } else {
        console.log("Form không hợp lệ, vui lòng kiểm tra lại các trường.");
    }
});