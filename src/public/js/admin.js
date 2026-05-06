// --- Auth Helper ---
function authFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    options.credentials = 'include';
    return fetch(url, options);
}

// --- Admin Data ---
async function loadAdminData() {
    try {
        const userRes = await authFetch('/api/users');
        const users = await userRes.json();
        
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = users.map(u => `
            <tr>
                <td>${u.username || 'N/A'}</td>
                <td>${u.userEmail || 'N/A'}</td> 
                <td>${u.role}</td>
                <td>
                    <button class="delete-user-btn" data-id="${u._id}">Delete User</button>
                </td>
            </tr>
        `).join('');

        const commentRes = await authFetch('/api/comments');
        const comments = await commentRes.json();
        
        const commentDiv = document.getElementById('allComments');
        commentDiv.innerHTML = comments.map(c => `
            <div class="comment-item" style="border-bottom: 1px solid #ccc; padding: 10px;">
                <p>
                    <strong>${c.author ? c.author.username : 'Deleted User'}:</strong> 
                    ${c.content}
                </p>
                <button class="delete-comment-btn" data-id="${c._id}">Delete Comment</button>
            </div>
        `).join('');

    } catch (err) {
        console.error("Error on fetching Admin data:", err);
    }
}

document.getElementById('createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('createUsername').value;
    const userEmail = document.getElementById('createEmail').value;
    const password = document.getElementById('createPassword').value;
    const role = document.getElementById('createRole').value;
    const statusDiv = document.getElementById('createStatus');

    try {
        const res = await authFetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, userEmail, password, role }) 
        });

        const data = await res.json();

        if (res.ok) {
            statusDiv.innerHTML = `<p style="color: green;">User created successfully!</p>`;
            document.getElementById('createUserForm').reset();
            loadAdminData(); 
        } else {
            statusDiv.innerHTML = `<p style="color: red;">${data.message || 'Error creating user'}</p>`;
        }
    } catch (err) {
        statusDiv.innerHTML = `<p style="color: red;">Network error.</p>`;
    }
});

document.getElementById('userTableBody').addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-user-btn')) {
        const userId = e.target.getAttribute('data-id');
        
        if (confirm("Delete this user permanently?")) {
            const res = await authFetch(`/api/users/${userId}`, { method: 'DELETE' });
            if (res.ok) {
                loadAdminData();
            } else {
                const error = await res.json();
                alert(`Error: ${error.message}`);
            }
        }
    }
});

document.getElementById('allComments').addEventListener('click', async (e) => {
    if (e.target.classList.contains("delete-comment-btn")) {
        const commentID = e.target.getAttribute('data-id');

        if (confirm("Delete this comment?")) {
            const res = await authFetch(`/api/comments/${commentID}`, { method: 'DELETE' });
            if (res.ok) {
                loadAdminData();
            } else {
                const error = await res.json();
                alert(`Error: ${error.message}`);
            }
        }
    }
});

document.querySelector('.logout-btn').addEventListener('click', () => {
    if (confirm("Sure you want to logout?")) {
        logout();
    }
});

async function logout() {
    try {
        document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace('/login');
    } catch (err) {
        window.location.href = '/login';
    }
}

loadAdminData();
