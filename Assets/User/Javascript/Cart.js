const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQcmVtaXVtIFVzZXIiLCJleHAiOjE3MjA2Nzk3ODB9.YG44-Jb08ZQPzUwSk6zM_d3tOd-9S0qbeJlTb7g-BrY'

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
                                    src="../../Assets/User/Images/HarryPotterBookCover.jpg"
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





    const deliveryAmount =10
    let subTotal = document.getElementById('sub-total');
    subTotal.innerText = data.total +data.discount;

    let discount = document.getElementById('discount');
    discount.innerText = data.discount;

    let delivery = document.getElementById('delivery');
    delivery.innerText = deliveryAmount;

    let finalTotal = document.getElementById('final-total')
    finalTotal.innerText = data.total + deliveryAmount;


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
    alert("Item Deleted from cart");
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


let checkoutBtn = document.getElementById('checkout-btn')

checkoutBtn.addEventListener('click',()=>checkout());

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
    alert("Checkout successful")
 
   
   
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
  .then(res => res.json())
  .then((data) => {
      console.log(data);
      populateCartData(data);
  })
  .catch((err) => {
      console.log(err.message);
      // Handle error
  });
}

fetchCartData()


