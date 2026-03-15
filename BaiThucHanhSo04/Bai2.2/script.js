const productPrices = {
    "laptop": 25000000,
    "phone": 28000000,
    "keyboard": 1200000,
    "mouse": 500000
};

const form = document.getElementById('orderForm');
const productSelect = document.getElementById('product');
const quantityInput = document.getElementById('quantity');
const totalPriceEl = document.getElementById('total-price');
const noteArea = document.getElementById('note');
const charCountEl = document.getElementById('char-count');
const modal = document.getElementById('confirmModal');
const summaryDiv = document.getElementById('summary');


const formatVND = (amount) => {
    return Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

function calculateTotal() {
    const price = productPrices[productSelect.value] || 0;
    const qty = parseInt(quantityInput.value) || 0;
    const total = price * qty;
    totalPriceEl.textContent = formatVND(total);
}

function showError(id, message) {
    const errSpan = document.getElementById(`err-${id}`);
    errSpan.textContent = message;
    const inputField = document.getElementById(id);
    if(inputField && id !== 'payment') inputField.style.borderColor = 'red';
}

function clearError(id) {
    const errSpan = document.getElementById(`err-${id}`);
    errSpan.textContent = '';
    const inputField = document.getElementById(id);
    if(inputField && id !== 'payment') inputField.style.borderColor = '#ccc';
}


productSelect.addEventListener('change', () => {
    calculateTotal();
    clearError('product');
});
quantityInput.addEventListener('input', () => {
    calculateTotal();
    clearError('quantity');
});

noteArea.addEventListener('input', () => {
    const len = noteArea.value.length;
    charCountEl.textContent = `${len}/200`;

    if (len > 200) {
        charCountEl.classList.add('over-limit');
        showError('note', 'Ghi chú không được vượt quá 200 ký tự');
    } else {
        charCountEl.classList.remove('over-limit');
        clearError('note');
    }
});

const inputsToValidate = ['product', 'quantity', 'deliveryDate', 'address'];
inputsToValidate.forEach(id => {
    document.getElementById(id).addEventListener('blur', () => validateField(id));
});

function validateField(id) {
    const val = document.getElementById(id).value.trim();

    if (id === 'product' && val === "") {
        showError(id, "Vui lòng chọn sản phẩm");
        return false;
    }
    if (id === 'quantity') {
        const qty = parseInt(val);
        if (isNaN(qty) || qty < 1 || qty > 99) {
            showError(id, "Số lượng phải từ 1 đến 99");
            return false;
        }
    }
    if (id === 'deliveryDate') {
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 30);

        if (!val) {
            showError(id, "Vui lòng chọn ngày giao");
            return false;
        }
        if (selectedDate < today) {
            showError(id, "Ngày giao không được ở quá khứ");
            return false;
        }
        if (selectedDate > maxDate) {
            showError(id, "Không được giao quá 30 ngày tới");
            return false;
        }
    }
    if (id === 'address' && val.length < 10) {
        showError(id, "Địa chỉ phải có ít nhất 10 ký tự");
        return false;
    }

    clearError(id);
    return true;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    inputsToValidate.forEach(id => {
        if (!validateField(id)) isValid = false;
    });

    const payment = document.querySelector('input[name="payment"]:checked');
    if (!payment) {
        showError('payment', "Vui lòng chọn phương thức thanh toán");
        isValid = false;
    } else {
        clearError('payment');
    }
    if (noteArea.value.length > 200) isValid = false;
    if (isValid) {
        const productName = productSelect.options[productSelect.selectedIndex].text;
        summaryDiv.innerHTML = `
            <p><strong>Sản phẩm:</strong> ${productName}</p>
            <p><strong>Số lượng:</strong> ${quantityInput.value}</p>
            <p><strong>Tổng tiền:</strong> ${totalPriceEl.textContent}</p>
            <p><strong>Ngày giao:</strong> ${document.getElementById('deliveryDate').value}</p>
            <p><strong>Thanh toán:</strong> ${payment.value}</p>
        `;
        modal.style.display = 'block';
    }
});

document.getElementById('btnCancel').addEventListener('click', () => {
    modal.style.display = 'none';
});

document.getElementById('btnConfirm').addEventListener('click', () => {
    alert("🎉 Chúc mừng! Đơn hàng của bạn đã được hệ thống ghi nhận thành công.");
    modal.style.display = 'none';
    form.reset();
    totalPriceEl.textContent = "0đ";
    charCountEl.textContent = "0/200";
});