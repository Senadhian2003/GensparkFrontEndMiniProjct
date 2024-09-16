console.log('Home page')

const token = localStorage.getItem('token')
let authentication = document.getElementById('authentication')

function updateAuthLink() {
    if(token) {
        authentication.innerHTML = `<a class="nav-link" href="#" onclick="logout()">Logout</a>`
    } else {
        authentication.innerHTML = `<a class="nav-link" href="./login.html">Login</a>`
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    Toast("Logged out successfully");
    setTimeout(() => {
        window.location.reload();
    }, 1500); // Redirect after 1.5 seconds
}

function Toast(message) {
    var myToast = Toastify({
        text: message,
        duration: 1000
    })
    myToast.showToast();
}

// Call this function when the page loads
updateAuthLink();