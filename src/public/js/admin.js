async function loadAdminData() {
    try {
        const userRes = await fetch('/api/users');
        const users = await userRes.json();
        
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = users.map(u => `
            <tr>
                <td>${u.username || 'N/A'}</td>
                <td>${u.userEmail || 'N/A'}</td> 
                <td>${u.role}</td>
                <td>
                    <button onclick="deleteUser('${u._id}')">Delete User</button>
                </td>
            </tr>
        `).join('');

        const commentRes = await fetch('/api/comments');
        const comments = await commentRes.json();
        
        const commentDiv = document.getElementById('allComments');
        commentDiv.innerHTML = comments.map(c => `
            <div class="comment-item" style="border-bottom: 1px solid #ccc; padding: 10px;">
                <p>
                    <strong>${c.author ? c.author.username : 'Deleted User'}:</strong> 
                    ${c.content}
                </p>
                <button onclick="deleteComment('${c._id}')">Delete Comment</button>
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
        const res = await fetch('/api/auth/register', {
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

async function deleteUser(id) {
    if (!id || id === 'undefined') {
        console.error("User ID invalid");
        return;
    }

    if (confirm("You sure wanna delete this user?")) {
        try {
            const res = await fetch(`/api/users/${id}`, { 
                method: 'DELETE',
                // important:if cookies are use,be sure to include it
                credentials: 'include' 
            });

            if (res.ok) {
                alert("User delete successfully");
                loadAdminData();
            } else {
                const error = await res.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error("Error on request", err);
        }
    }
}

loadAdminData();