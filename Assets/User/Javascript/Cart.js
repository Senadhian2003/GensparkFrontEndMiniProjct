// const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQcmVtaXVtIFVzZXIiLCJleHAiOjE3MjA2Nzk3ODB9.YG44-Jb08ZQPzUwSk6zM_d3tOd-9S0qbeJlTb7g-BrY'

const userToken = localStorage.getItem('token')

if(!userToken){
  Toast("User login required");
    setTimeout(() => {
        window.location.href = './login.html';
    }, 1500); // Redirect after 1.5 seconds
}
else{

  fetchCartData()
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

function populateEmptyCart(){

  let cartItemsDivision = document.getElementById('cart-items')

  cartItemsDivision.innerHTML=`<img
                  src="https://supershopping.lk/images/home/Cart-empty.gif"
                  height="450px"
                  width="700px"
                  alt=""
                />`

  let checkoutContainer = document.getElementById('checkout-container')
  checkoutContainer.innerHTML=`<p
                  class="plus-jakarta-sans-ExtraBold"
                  style="
                    font-size: 70px;
                    line-height: 89px;
                    letter-spacing: 0.01px;
                  "
                >
                  Add books <br />
                  To your<br />
                  Cart <br />
                  And enjoy
                </p>

                <a href="./Books.html"
                  ><button class="btn btn-primary" style="width: 100%">
                    Browse Books
                  </button></a
                >`



}

function populateCartData(data){

    let cartItemsDivision = document.getElementById('cart-items')

    let innerCardsHTML = ``;

    let cartItemsList = data.items;
    let itemCost=0
    cartItemsList.forEach((item,index) => {
        
        innerCardsHTML+=`<div class="cart-item" data-item-id="${index}">
                            <div class="d-flex justify-content-end">
                              <img class="close-img"   onclick="deleteCartItem(${item.bookId})" height="18px" width="18px" src="../../Assets/User/Images/close.png" alt="">
                            </div>
                            <div class="row">
                                <div
                                
                                  class="col-sm-4 col"
                                  style="display: flex; justify-content: center; align-items: center"
                                >
                                  <img
                                    class="book-img"
                                    height="150px"
                                    width="100px"
                                    src="${item.image 
                                      ? `data:image/jpeg;base64,${item.image}`
                                      : '../../Assets/User/Images/BookCover.avif'}"
                                    alt=""
                                  
                                  />
                                </div>
                      
                                <div class="col-sm-8 col">
                                  <p class="title">${item.bookName}</p>
                                  <p class="author">${item.authorName}</p>
                                  
                      
                                  <p class="price">$${item.price}</p>
                      
                                 
                      
                                  
                      
                                  <div class="d-flex">
                                    <div class="stock-input" >
                                       <button class="stock-btn minus" data-item-id="${index}">-</button>
                                      <input
                                      style="width: 30px; height: 20px;"
                                        id="quantity-${item.bookId}"
                                        type="number"
                                        class="stock-input-field"
                                        value="${item.quantity}"
                                        min="0"
                                      />
                                      <button class="stock-btn plus" data-item-id="${index}">+</button>
                        <button class="blue update-btn" style="margin-left: 24px; border:none"  data-item-id="${index}">Update</button>

                                    </div>
                      
                                  
                                  </div>
                                </div>
                              </div>



                        </div>`




    });

    


    cartItemsDivision.innerHTML = innerCardsHTML;


     // Add event listeners to buttons
     cartItemsList.forEach((item, index) => {
      const minusBtn = document.querySelector(`.minus[data-item-id="${index}"]`);
      const plusBtn = document.querySelector(`.plus[data-item-id="${index}"]`);
      const quantityInput = document.getElementById(`quantity-${index}`);
      const updateBtn = document.querySelector(`.update-btn[data-item-id="${index}"]`);

      minusBtn.addEventListener('click', () => updateQuantity(item.bookId, -1));
      plusBtn.addEventListener('click', () => updateQuantity(item.bookId, 1));
      updateBtn.addEventListener('click', () => handleUpdate(item.bookId));
  });

    let checkoutContainer = document.getElementById('checkout-container')

    const deliveryAmount =10
    checkoutContainer.innerHTML=`<div class="checkout-card">

                        <p class="heading" >Order Summary</p>

                        <div class="d-flex justify-content-between">
                            <p class="left-text">Subtotal</p>
                            <p class="right-text" id="sub-total">$${data.total +data.discount}</p>
                        </div>

                        <div class="d-flex justify-content-between">
                          <p class="left-text">Discount</p>
                          <p class="right-text" id="discount">$${data.discount}</p>
                      </div>

                        <div class="d-flex justify-content-between">
                            <p class="left-text">Delivery</p>
                            <p class="right-text" id="delivery">$${deliveryAmount}</p>
                        </div>

                        

                        <hr>
                        <div class="d-flex justify-content-between">
                            <p class="left-text">Total</p>
                            <p class="right-text" id="final-total">$${data.total + deliveryAmount}</p>
                        </div>

                        <button class="btn btn-primary" onclick="checkout()" id="checkout-btn" style="width: 100%">
                            Checkout
                          </button>`



    
    // let subTotal = document.getElementById('sub-total');
    // subTotal.innerText = data.total +data.discount;

    // let discount = document.getElementById('discount');
    // discount.innerText = data.discount;

    // let delivery = document.getElementById('delivery');
    // delivery.innerText = deliveryAmount;

    // let finalTotal = document.getElementById('final-total')
    // finalTotal.innerText = data.total + deliveryAmount;


}


function updateQuantity(itemId, change) {
  const quantityInput = document.getElementById(`quantity-${itemId}`);
  let newQuantity = parseInt(quantityInput.value) + change;
  newQuantity = Math.max(0, newQuantity); // Ensure quantity doesn't go below 0
  quantityInput.value = newQuantity;
}


function handleUpdate(itemId) {
  const quantity = document.getElementById(`quantity-${itemId}`).value;
  // Here you would typically send an AJAX request to update the quantity on the server
  console.log(`Update item ${itemId} to quantity ${quantity}`);
  AddBookToCart(itemId,quantity)
  
}

function deleteCartItem(bookId){

  fetch('http://localhost:5022/api/Cart/DeleteItemFromCart', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      "bookId": bookId
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    Toast("Item Deleted from cart");
    fetchCartData(); 
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Failed to add item to cart");
  });



}


function AddBookToCart(bookId, quantity) {
  fetch('http://localhost:5022/api/Cart/AddItemToCart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      "bookId": bookId,
      "quantity": quantity
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    alert("Item added to cart");
    fetchCartData(); 
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Failed to add item to cart");



  });
}


// let checkoutBtn = document.getElementById('checkout-btn')

// checkoutBtn.addEventListener('click',()=>checkout());

let checkout = ()=>{

  fetch(`http://localhost:5022/api/Cart/CheckoutCart`,{
    method : "POST",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
    }
}).then(res=> res.json())
.then((data)=>{
    console.log(data)
    Toast("Checkout successful")

    setTimeout(() => {
          window.location.href = './Books.html';
      }, 2000); // Redirect after 2 seconds
   
}).catch((err)=>{
    console.log(err.message)
    // createErrorRow(err.message)

})



}


function fetchCartData() {
  fetch(`http://localhost:5022/api/Cart/ViewCartItems`, {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
      }
  })
  .then(async(res) => {
    if (res.status === 401) {
      // Handle 401 Unauthorized
      Toast("Unauthorized: Please log in");
      setTimeout(() => {
          window.location.href = './login.html';
      }, 2000); // Redirect after 2 seconds
      throw new Error("Unauthorized");
  }
  
  if (!res.ok) {
      // For other error statuses, parse the error response
      const errorData = await res.json();
      throw errorData;
  }
  
  return res.json();
  })
  .then((data) => {
      console.log(data);
      populateCartData(data);
  })
  .catch((error) => {
    console.error('Error:', error);
    // Display the error message
    populateEmptyCart()
    if (error.message && error.message !== "Unauthorized") {
        Toast(error.message);
    } else if (error.message !== "Unauthorized") {
        // Fallback for unexpected errors
        Toast("An unexpected error occurred");
    }
  });
}



