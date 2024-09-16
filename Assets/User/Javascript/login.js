let loginBtn = document.getElementById('login-btn')

loginBtn.addEventListener('click',()=>login())


let validateUserId = () =>{
    
    
    const id = document.querySelector("#user-id").value;
    const validationMessage = document.querySelector("#idHelp");
  
    if (!id) {
        validationMessage.textContent = "User Id cannot be empty";
        validationMessage.style.color = "red";
        return false
    }
    else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true
    }

}

let validatePassword = () =>{
    
    
    const name = document.querySelector("#user-password").value;
    const validationMessage = document.querySelector("#passwordHelp");
  
    if (!name) {
        validationMessage.textContent = "Password cannot be empty";
        validationMessage.style.color = "red";
        return false
    }
    else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true
    }

}

function login(){

    let userId = document.getElementById('user-id').value
    let password = document.getElementById('user-password').value

    console.log(userId, password)


    fetch('http://localhost:5022/api/Authentication/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
                },
        body: JSON.stringify(
            {
                "userId": userId,
                "password": password
              }
        )
    }).then( async(res) => {
        if (!res.ok) {
            // Parse the error response
            const errorData = await res.json();
            throw errorData;
        }
        return res.json();
    }).then((data) => {
        console.log(data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);
        Toast("User login successful")
        
        
        setTimeout(() => {
            if(data.role=="Admin"){
                window.location.href = '../Admin/ReturnPending.html';
            }
            else{
                window.location.href = './Home.html';
            }
           
        }, 1500);
        
    }).catch((error) => {
        console.error('Error:', error);
        // Display the error message
        if (error.message) {
            // Use your error display method here, for example:
            Toast(error.message);
        } else {
            // Fallback for unexpected errors
            Toast("An unexpected error occurred");
        }
       
    });




}


function  Toast(message){

    var myToast = Toastify({
        text: message,
        duration: 1000
       })
       myToast.showToast();

}