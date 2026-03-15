let currentStep = 1;

const form = document.getElementById('multi-step-form');
const steps = document.querySelectorAll('.step');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');
const progressBar = document.getElementById('progress-bar');
const stepText = document.getElementById('current-step-text');
const percentText = document.getElementById('percent-text');

const inputs = {
    fullName: document.getElementById('fullName'),
    dob: document.getElementById('dob'),
    gender: document.getElementById('gender'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword')
};

function validate() {
    let isValid = false;

    if (currentStep === 1) {
        isValid = inputs.fullName.value.trim() !== "" &&
            inputs.dob.value !== "" &&
            inputs.gender.value !== "";
    } else if (currentStep === 2) {
        const emailValid = /\S+@\S+\.\S+/.test(inputs.email.value);
        const passValid = inputs.password.value.length >= 6;
        const match = inputs.password.value === inputs.confirmPassword.value && inputs.confirmPassword.value !== "";

        document.getElementById('pwd-error').innerText = match ? "" : "Mật khẩu không khớp hoặc quá ngắn";
        isValid = emailValid && passValid && match;
    } else {
        isValid = true;
    }

    nextBtn.disabled = !isValid;
}

function updateUI() {
    steps.forEach((step, index) => {
        step.classList.toggle('active', index === currentStep - 1);
    });

    const percent = Math.round((currentStep / 3) * 100);
    progressBar.style.width = percent + "%";
    stepText.innerText = currentStep;
    percentText.innerText = percent + "%";

    prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';

    if (currentStep === 3) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
        renderSummary();
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }

    validate();
}

function renderSummary() {
    const summary = document.getElementById('summary-info');
    summary.innerHTML = `
        <p><b>Họ tên:</b> ${inputs.fullName.value}</p>
        <p><b>Ngày sinh:</b> ${inputs.dob.value}</p>
        <p><b>Giới tính:</b> ${inputs.gender.value}</p>
        <p><b>Email:</b> ${inputs.email.value}</p>
        <p><b>Mật khẩu:</b> ********</p>
    `;
}

nextBtn.addEventListener('click', () => { currentStep++; updateUI(); });
prevBtn.addEventListener('click', () => { currentStep--; updateUI(); });
form.addEventListener('input', validate);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Đăng ký thành công!");
    console.log("Dữ liệu:", {
        name: inputs.fullName.value,
        email: inputs.email.value
    });
});

updateUI();