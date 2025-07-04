document.addEventListener('DOMContentLoaded', function() {
    const nameFilter = document.getElementById('name-filter');
    const ageFilter = document.getElementById('age-filter');
    const applyFilterBtn = document.getElementById('apply-filter');
    const userList = document.getElementById('user-list');
    const totalCount = document.getElementById('total-count');
    const avgAge = document.getElementById('avg-age');
    const errorMessage = document.getElementById('error-message');
    const tableHeaders = document.querySelectorAll('th[data-sort]');

    let users = [];
    let filteredUsers = [];
    let sortDirection = { name: 'asc', age: 'asc' };

    // Загрузка данных
    fetch('users.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки данных');
            }
            return response.json();
        })
        .then(data => {
            users = data;
            filteredUsers = [...users];
            renderUsers();
            updateStats();
        })
        .catch(error => {
            showError(error.message);
        });

    // Применение фильтров
    applyFilterBtn.addEventListener('click', applyFilters);

    // Сортировка по заголовкам таблицы
    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sortKey = header.dataset.sort;
            sortUsers(sortKey);
            renderUsers();
        });
    });

    function applyFilters() {
        const nameValue = nameFilter.value.toLowerCase();
        const ageValue = ageFilter.value;

        filteredUsers = users.filter(user => {
            const nameMatch = user.name.toLowerCase().includes(nameValue);
            const ageMatch = ageValue ? user.age === parseInt(ageValue) : true;
            return nameMatch && ageMatch;
        });

        renderUsers();
        updateStats();
    }

    function sortUsers(key) {
        sortDirection[key] = sortDirection[key] === 'asc' ? 'desc' : 'asc';

        filteredUsers.sort((a, b) => {
            if (a[key] < b[key]) return sortDirection[key] === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return sortDirection[key] === 'asc' ? 1 : -1;
            return 0;
        });

        // Обновляем стрелки сортировки
        tableHeaders.forEach(header => {
            header.innerHTML = header.textContent.replace(/[↑↓]/, '');
            if (header.dataset.sort === key) {
                header.innerHTML += sortDirection[key] === 'asc' ? ' ▼' : ' ▲';
            }
        });
    }

    function renderUsers() {
        userList.innerHTML = '';

        if (filteredUsers.length === 0) {
            userList.innerHTML = '<tr><td colspan="3" style="text-align: center;">Пользователи не найдены</td></tr>';
            return;
        }

        filteredUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.age}</td>
                <td><a href="mailto:${user.email}">${user.email}</a></td>
            `;
            userList.appendChild(row);
        });
    }

    function updateStats() {
        totalCount.textContent = filteredUsers.length;

        if (filteredUsers.length > 0) {
            const sumAge = filteredUsers.reduce((sum, user) => sum + user.age, 0);
            const average = Math.round(sumAge / filteredUsers.length);
            avgAge.textContent = average;
        } else {
            avgAge.textContent = '0';
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});