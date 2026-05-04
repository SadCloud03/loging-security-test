document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const userEmail = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const statusDiv = document.getElementById('regStatus');

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        
            body: JSON.stringify({ 
                username, 
                userEmail, 
                password, 
                role: 'user' // by default every new user would be an 'user'
            })
        });

        const data = await res.json();

        if (res.ok) {
            statusDiv.innerHTML = `<p style="color: green;">Registration successful! Redirecting...</p>`;
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            statusDiv.innerHTML = `<p style="color: red;">${data.message || 'Error during registration'}</p>`;
        }
    } catch (err) {
        console.error("Register error:", err);
        statusDiv.innerHTML = `<p style="color: red;">Network error. Please try again.</p>`;
    }
});