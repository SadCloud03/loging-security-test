// --- begining ---
document.addEventListener('DOMContentLoaded', () => {
    loadComments();
});

// --- section : comments  ---

async function loadComments() {
    try {
        const res = await fetch('/api/comments', { credentials: 'include' });
        
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
        const res = await fetch('/api/comments', {
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
        const res = await fetch('/api/users/me', { 
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
    return `<button onclick="deleteMyComment('${comment._id}')" style="color: red;">Delete</button>`;
}

async function deleteMyComment(id) {
    if (confirm("Delete comment?")) {
        const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadComments();
        } else {
            alert("You dont have permission to delete this comment.");
        }
    }
}

async function logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
}