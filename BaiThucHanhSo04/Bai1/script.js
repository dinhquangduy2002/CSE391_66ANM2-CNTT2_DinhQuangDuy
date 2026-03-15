let students = [];
let sortDirection = 'none';
const txtName = document.getElementById('txtName');
const txtScore = document.getElementById('txtScore');
const btnAdd = document.getElementById('btnAdd');
const tableBody = document.getElementById('studentTableBody');
const statsDiv = document.getElementById('stats');

const txtSearch = document.getElementById('txtSearch');
const filterRank = document.getElementById('filterRank');
const thScore = document.getElementById('thScore');
const sortIcon = document.getElementById('sortIcon');

function getRank(score) {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7.0) return "Khá";
    if (score >= 5.0) return "Trung bình";
    return "Yếu";
}

function applyFilters() {
    let filtered = [...students];
    const keyword = txtSearch.value.toLowerCase().trim();
    if (keyword !== "") {
        filtered = filtered.filter(s => s.name.toLowerCase().includes(keyword));
    }
    const selectedRank = filterRank.value;
    if (selectedRank !== "Tất cả") {
        filtered = filtered.filter(s => getRank(s.score) === selectedRank);
    }
    if (sortDirection === 'asc') {
        filtered.sort((a, b) => a.score - b.score);
        sortIcon.innerHTML = "▲";
    } else if (sortDirection === 'desc') {
        filtered.sort((a, b) => b.score - a.score);
        sortIcon.innerHTML = "▼";
    } else {
        sortIcon.innerHTML = "↕";
    }

    renderTable(filtered);
}

function renderTable(dataList) {
    tableBody.innerHTML = "";
    let totalScore = 0;

    if (dataList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="no-result">Không có kết quả phù hợp</td></tr>`;
    } else {
        dataList.forEach((student, index) => {
            totalScore += student.score;
            const row = document.createElement('tr');
            if (student.score < 5) row.classList.add('bg-yellow');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.score.toFixed(1)}</td>
                <td>${getRank(student.score)}</td>
                <td>
                    <button class="btn-delete" data-id="${student.id}">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    const count = dataList.length;
    const avg = count > 0 ? (totalScore / count).toFixed(2) : "0.00";
    statsDiv.innerHTML = `Đang hiển thị: ${count} | Điểm trung bình nhóm này: ${avg}`;
}

function handleAdd() {
    const name = txtName.value.trim();
    const score = parseFloat(txtScore.value);

    if (name === "" || isNaN(score) || score < 0 || score > 10) {
        alert("Vui lòng nhập đúng tên và điểm (0-10)!");
        return;
    }

    students.push({ id: Date.now(), name, score });

    txtName.value = "";
    txtScore.value = "";
    applyFilters();
}

btnAdd.addEventListener('click', handleAdd);
txtSearch.addEventListener('input', applyFilters);
filterRank.addEventListener('change', applyFilters);
thScore.addEventListener('click', () => {
    if (sortDirection === 'none' || sortDirection === 'desc') {
        sortDirection = 'asc';
    } else {
        sortDirection = 'desc';
    }
    applyFilters();
});

tableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
        const idToDelete = parseInt(e.target.getAttribute('data-id'));
        if (confirm("Bạn có chắc muốn xóa?")) {
            students = students.filter(s => s.id !== idToDelete);
            applyFilters();
        }
    }
});
txtScore.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleAdd();
    }
});