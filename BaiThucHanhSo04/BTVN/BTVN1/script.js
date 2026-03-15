const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const displayName = document.getElementById('displayName');

const fullnameInput = document.getElementById('fullname');
const charCount = document.getElementById('char-count');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const strengthMeter = document.querySelector('.strength-meter');

function showError(fieldId, message) {
    const inputField = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}-error`);
    if (inputField && inputField.type !== 'radio' && inputField.type !== 'checkbox') {
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

fullnameInput.addEventListener('input', function() {
    const len = this.value.length;
    charCount.innerText = `${len}/50`;
    clearError('fullname');
});

togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.innerText = type === 'password' ? '👁️' : '🙈';
});

passwordInput.addEventListener('input', function() {
    const val = this.value;
    clearError('password');
    if (val !== '') {
        strengthMeter.style.display = 'block';
        checkStrength(val);
    } else {
        strengthMeter.style.display = 'none';
        strengthText.innerText = '';
    }
});

function checkStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    strengthBar.className = '';
    if (score <= 1) {
        strengthBar.classList.add('weak');
        strengthText.innerText = 'Yếu';
        strengthText.style.color = '#ff4d4d';
    } else if (score <= 3) {
        strengthBar.classList.add('medium');
        strengthText.innerText = 'Trung bình';
        strengthText.style.color = '#ffad33';
    } else {
        strengthBar.classList.add('strong');
        strengthText.innerText = 'Mạnh';
        strengthText.style.color = '#28a745';
    }
}

// 6. Các hàm Validate
function validateFullname() {
    const val = fullnameInput.value.trim();
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]{3,50}$/;
    if (val === '') {
        showError('fullname', 'Họ tên không được để trống');
        return false;
    } else if (!nameRegex.test(val)) {
        showError('fullname', 'Tên từ 3-50 ký tự, chỉ chứa chữ cái');
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
        showError('email', 'Email sai định dạng');
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
        showError('phone', 'SĐT phải có 10 chữ số, bắt đầu bằng 0');
        return false;
    }
    clearError('phone');
    return true;
}

function validatePassword() {
    const val = passwordInput.value;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (val === '') {
        showError('password', 'Mật khẩu không được để trống');
        return false;
    } else if (!passRegex.test(val)) {
        showError('password', 'Mật khẩu tối thiểu 8 ký tự, có chữ hoa, thường và số');
        return false;
    }
    clearError('password');
    return true;
}

function validateConfirmPassword() {
    const pass = passwordInput.value;
    const confirm = document.getElementById('confirmPassword').value;
    if (confirm === '') {
        showError('confirmPassword', 'Vui lòng xác nhận mật khẩu');
        return false;
    } else if (confirm !== pass) {
        showError('confirmPassword', 'Mật khẩu không khớp');
        return false;
    }
    clearError('confirmPassword');
    return true;
}

function validateGender() {
    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
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
    { id: 'confirmPassword', validate: validateConfirmPassword }
];

fields.forEach(field => {
    const element = document.getElementById(field.id);
    element.addEventListener('blur', field.validate);
    element.addEventListener('input', () => clearError(field.id));
});

document.getElementsByName('gender').forEach(r => r.addEventListener('change', validateGender));
document.getElementById('terms').addEventListener('change', validateTerms);

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const isNameValid = validateFullname();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPassValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    const isGenderValid = validateGender();
    const isTermsValid = validateTerms();

    if (isNameValid && isEmailValid && isPhoneValid && isPassValid &&
        isConfirmValid && isGenderValid && isTermsValid) {

        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
        displayName.innerText = fullnameInput.value;
    }
});