
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    document.querySelector('.actions').addEventListener('click', async (e) => {
        if (e.target.classList.contains('login-btn')) {
            const loginType = e.target.getAttribute('data-type');
            await handleLogin(loginType);
        }
    });
});

async function handleLogin(type) {
    const userEmail = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Enviamos el 'type' para que el backend sepa qué lógica aplicar
            body: JSON.stringify({ userEmail, password, type }) 
        });

        const data = await res.json();
        
        if (res.ok) {
            if (type === 'jwt') {
                // MANTENER CONEXIÓN (Stateless): El cliente guarda el secreto
                localStorage.setItem('token', data.token);
                console.log("Modo Stateless: Token guardado en LocalStorage");
            } else {
                // MANTENER CONEXIÓN (Stateful): El navegador guarda la cookie automáticamente
                localStorage.removeItem('token'); // Limpiamos por seguridad
                console.log("Modo Stateful: Sesión gestionada por Cookie HttpOnly");
            }
            
            window.location.href = data.role === 'admin' ? '/admin' : '/user';
        } else {
            alert(data.message || "Error en el login");
        }
    } catch (err) {
        console.error("Error:", err);
    }
}