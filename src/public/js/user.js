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

// --- beginning ---
document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    loadComments();
});

// If JWT mode, username/email won't be server-rendered — fetch them from the API
async function loadUserInfo() {
    const usernameEl = document.getElementById('displayUsername');
    const emailEl = document.getElementById('displayEmail');

    // Already populated server-side (cookie mode)
    if (usernameEl && usernameEl.textContent.trim() !== '') return;

    try {
        const res = await authFetch('/api/users/me');
        if (!res.ok) {
            window.location.replace('/login');
            return;
        }
        const user = await res.json();
        if (usernameEl) usernameEl.textContent = user.username;
        if (emailEl) emailEl.textContent = user.userEmail;
    } catch (err) {
        console.error("Error loading user info:", err);
    }
}

// --- section : comments  ---

async function loadComments() {
    try {
        const res = await authFetch('/api/comments');
        
        if (!res.ok) throw new Error("Unauthorized or server error");
        
        const comments = await res.json();
        const commentsList = document.getElementById('commentsList');
        
        if (comments.length === 0) {
            commentsList.innerHTML = "<p>No comments yet.</p>";
            return;
        }

        commentsList.innerHTML = comments.map(c => `
            <div class="comment-card" style="border: 1px solid #eee; padding: 10px; margin-bottom: 10px;">
                <p>
                    <strong>${c.author ? c.author.username : 'Deleted User'}</strong> 
                    <small>${new Date(c.createdAt).toLocaleString()}</small>
                </p>
                <p>${c.content}</p>
                ${renderDeleteButton(c)}
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading comments:", err);
    }
}

document.getElementById('commentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const commentInput = document.getElementById('commentContent');
    const contentValue = commentInput.value.trim();

    if (!contentValue) return;

    try {
        const res = await authFetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: contentValue })
        });

        if (res.ok) {
            commentInput.value = '';
            loadComments();
        } else {
            alert("Comment Post Error.");
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
});

// --- section : Update User ---

document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;

    const updateData = {};
    if (username) updateData.username = username;
    if (password) updateData.password = password;

    if (Object.keys(updateData).length === 0) {
        return alert("Insert data to update.");
    }

    try {
        const res = await authFetch('/api/users/me', { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        if (res.ok) {
            alert("User updated");
            location.reload(); 
        } else {
            const error = await res.json();
            alert("Error: " + error.message);
        }
    } catch (err) {
        console.error("Update error:", err);
    }
});

// --- Support Functions ---

function renderDeleteButton(comment) {
    return `<button class="delete-comment-btn" data-id="${comment._id}" style="color: red;">Delete</button>`;
}

document.getElementById('commentsList').addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-comment-btn')) {
        const commentId = e.target.getAttribute('data-id');
        
        if (confirm("Sure you want to delete this?")) {
            const res = await authFetch(`/api/comments/${commentId}`, { method: 'DELETE' });
            if (res.ok) {
                loadComments();
            } else {
                const error = await res.json();
                alert(error.message || "No authorization or Error");
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
