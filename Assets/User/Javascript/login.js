let loginBtn = document.getElementById('login-btn')

loginBtn.addEventListener('click',()=>login())


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
    }).then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    }).then((data) => {
        console.log(data);
      
        
    }).catch((error) => {
        console.error('Error:', error);
       
    });




}