const userToken = localStorage.getItem('token')


let authentication = document.getElementById('authentication')

function updateAuthLink() {
    if(userToken) {
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

const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');
console.log('Book ID:', bookId);



  let applyRatings = ()=>{
    const ratings = document.querySelectorAll(".rating");
  
    ratings.forEach((ratingElement) => {
      const rating = parseFloat(
        ratingElement.querySelector(".rating-count").textContent
      );
      const stars = ratingElement.querySelectorAll(".fa-star");
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating - fullStars >= 0.5;
  
      for (let i = 0; i < stars.length; i++) {
        if (i < fullStars) {
          stars[i].classList.add("checked");
        } else if (i === fullStars && hasHalfStar) {
          stars[i].classList.add("checked", "fa-star-half-o");
        } else {
          stars[i].classList.add("fa-star-o");
        }
      }
    });
  
  }

  function handleInputChange(event) {
    const button = event.target;
    
    const quantityInput = document.getElementById('Quantity');
  
    if (button.matches('.minus')) {
      if (quantityInput.value > 0) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
      }
    } else if (button.matches('.plus')) {
      quantityInput.value = parseInt(quantityInput.value) + 1;
    }
  
    
  }

  const minusButton = document.getElementById('SubQuantity')
  const quantityInput = document.getElementById('Quantity')
  const plusButton = document.getElementById('AddQuantity')

  minusButton.addEventListener('click', handleInputChange);
  quantityInput.addEventListener('input', handleInputChange);
  plusButton.addEventListener('click', handleInputChange);

function populateBookdata(stock){

    const avgRating = stock.book.avgRating/stock.book.ratingCount;

    let title = document.querySelector('.title');
    let category = document.querySelector('.category');
    let author = document.querySelector('.author');
    let price = document.querySelector('.price');
    let content = document.querySelector('.content');
    let rating = document.querySelector('.rating');
    let stock_content = document.querySelector('.stock-content');
    title.textContent = stock.book.title
    category.textContent = stock.book.category
    author.innerHTML = `${stock.book.author.authorName} <span style="font-size: 14px;" class="publisher"><small>published by ${stock.book.publisher.publisherName}</small></span>`;
    
    rating.innerHTML = `<span class="rating-count" style="color: black">${avgRating?formatPercentage(avgRating):'0.00'}</span>
              <span class="fa fa-star" id="1"></span>
              <span class="fa fa-star" id="2"></span>
              <span class="fa fa-star" id="3"></span>
              <span class="fa fa-star" id="4"></span>
              <span class="fa fa-star" id="5"></span>
              <span style="font-size: 14px; color: black">(${stock.book.ratingCount})</span>`

    price.textContent = '$ ' + stock.pricePerBook;
    content.textContent = stock.book.description;
    stock_content.textContent = stock.quantityInStock + ' books in stock'
    const bookImage = document.getElementById('book-detail');

// Set the source of the image
bookImage.src = stock.image
  ? `data:image/jpeg;base64,${stock.image}`
  : '../../Assets/User/Images/BookCover.avif';
    applyRatings()
}

function populateFeedbackData(feedbackData){

    let splitRating = document.getElementById('splitRating')
    splitRating.innerHTML = `<span class="rating-count" style="color: black"
                                  >${formatPercentage(feedbackData.averageRating)}</span
                                >
                                <span class="fa fa-star" id="1"></span>
                                <span class="fa fa-star" id="2"></span>
                                <span class="fa fa-star" id="3"></span>
                                <span class="fa fa-star" id="4"></span>
                                <span class="fa fa-star" id="5"></span>
                                <span style="font-size: 14px; color: black">(${feedbackData.feedbacks.length})</span>`

    let progress = document.getElementById('feedback-progress')

    progress.innerHTML = `<div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  style="width: ${formatPercentage(feedbackData.fiveStarPercentage)}%"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                ${formatPercentage(feedbackData.fiveStarPercentage)}%
                </div>
              </div>

              <div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  style="width: ${formatPercentage(feedbackData.fourStarPercentage)}%"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                ${formatPercentage(feedbackData.fourStarPercentage)}%
                </div>
              </div>

              <div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  style="width: ${formatPercentage(feedbackData.threeStarPercentage)}%"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                 ${formatPercentage(feedbackData.threeStarPercentage)}%
                </div>
              </div>

              <div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  style="width: ${formatPercentage(feedbackData.twoStarPercentage)}%"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                 ${formatPercentage(feedbackData.twoStarPercentage)}%
                </div>
              </div>

              <div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  style="width: ${formatPercentage(feedbackData.oneStarPercentage)}%"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                 ${formatPercentage(feedbackData.oneStarPercentage)}%
                </div>
              </div>`

    let booksFeedback = document.getElementById('book-feedback')
    let feedbackList = feedbackData.feedbacks;

    let feedbackHtml = ``
    feedbackList.forEach(feedback => {
        
        feedbackHtml+=`<div class="feedback" style="margin-top: 20px; margin-bottom: 70px;">
                        <div class="profile d-flex justify-content-between">
                          <div class="d-flex">
                            <div class="user-img">
                              <img height="21px" width="21px" src="../../Assets/User/Images/user.png" alt="" />
                            </div>
        
                            <div class="text" style="margin-top: 8px;">
                              <p class="user-name" >${feedback.user.name}</p>
                              <div class="rating"  style="font-size: 14px;">
                                <span class="rating-count" style="color: black"
                                  >${feedback.rating}</span
                                >
                                <span class="fa fa-star" id="1"></span>
                                <span class="fa fa-star" id="2"></span>
                                <span class="fa fa-star" id="3"></span>
                                <span class="fa fa-star" id="4"></span>
                                <span class="fa fa-star" id="5"></span>
                               
                              </div>
                            </div>
                          </div>
                          <div class="date">
                            <p>${feedback.feedbackDate.slice(0,10)}</p>
                          </div>
                        </div>
                        
                        <div class="feedback-content" style="margin-top: 18px;">
        
                            <p class="feedback-heading" >${feedback.feedbackHeading}</p>
                            <p class="feedback-description" > ${feedback.message}</p>
        
                        </div>
                      </div>`

    });

    booksFeedback.innerHTML = feedbackHtml
    applyRatings()
}


const submitBtn = document.getElementById('submit-btn')

submitBtn.addEventListener('click', () => GetItemQuantityAndAddToCart(bookId));
  

function GetItemQuantityAndAddToCart(bookId){

  const quantityInput = document.getElementById('Quantity').value

  AddBookToCart(bookId,quantityInput)

}

function validateText(element){
  
  const name = document.querySelector("#" + element).value;
  const validationMessage = document.querySelector("#"+ element +"Help");
  
  if (!name) {
      validationMessage.textContent = "Heading cannot be empty";
      validationMessage.style.color = "red";
      return false
  }
  else {
      validationMessage.textContent = "Accepted";
      validationMessage.style.color = "green";
      return true
  }

}

function giveFeedbackRating(starNumber) {
  let feedbackStarCount = document.getElementById("giveRatingStar");
  feedbackStarCount.textContent = starNumber;

  const ratings = document.querySelector(".feedback-rating");
  const stars = ratings.querySelectorAll(".fa");
  
  stars.forEach((star, index) => {
      if (index < starNumber) {
          star.classList.remove('fa-star-o');
          star.classList.add('fa-star');
      } else {
          star.classList.remove('fa-star');
          star.classList.add('fa-star-o');
      }
  });
}

function giveFeedback(){

 
  let flag = validateText("Heading");   
    flag = validateText("Description") && flag ;
  
  if(flag){
    let feedbackStarCount = document.getElementById("giveRatingStar").textContent;
    let heading = document.getElementById('Heading').value
    let description = document.getElementById('Description').value

    console.log(feedbackStarCount, heading, description)

    fetch('http://localhost:5022/api/Book/GiveFeedBack', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
          
      },
      body: JSON.stringify({
        "bookId": bookId,
        "feedbackHeading": heading,
        "message": description,
        "rating": feedbackStarCount
      })
  })
  .then(async (res) => {
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
    console.log('Success:', data);
    Toast("Feedback submitted");
    setTimeout(() => {
      window.location.reload();
  }, 2000);
  })
  .catch((error) => {
    console.error('Error:', error);
    // Display the error message
    if (error.message && error.message !== "Unauthorized") {
        Toast(error.message);
    } else if (error.message !== "Unauthorized") {
        // Fallback for unexpected errors
        Toast("An unexpected error occurred");
    }
  });
  



  }
  else{
    Toast("Please enter all the details for feedback")
  }



  

}


  
  fetch(`http://localhost:5022/api/Book/ViewSaleBookDetail?bookId=${bookId}`,{
    method : "GET"
}).then(res=> res.json())
.then((data)=>{
    console.log(data)
    populateBookdata(data);
   
}).catch((err)=>{
    console.log(err.message)
    // createErrorRow(err.message)

})

function formatPercentage(value) {
  if (Number.isInteger(value)) {
    return value;
  } else {
    return Number(value.toFixed(1));
  }
}

fetch(`http://localhost:5022/api/Book/ViewFeedback?BookId=${bookId}`,{
    method : "GET"
}).then(async (res) => {
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
.then((data)=>{
    console.log(data)

    populateFeedbackData(data)
   
   
}).catch((error)=>{
    console.log(error.message)
    if (error.message && error.message !== "Unauthorized") {
      Toast(error.message);
  } else if (error.message !== "Unauthorized") {
      // Fallback for unexpected errors
      Toast("An unexpected error occurred");
  }

})


function AddBookToCart(bookId, quantity){

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
.then(async (res) => {
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
  console.log('Success:', data);
  Toast("Item added to cart")
  // Handle successful response
})
.catch((error) => {
  console.error('Error:', error);
  // Display the error message
  if (error.message && error.message !== "Unauthorized") {
      Toast(error.message);
  } else if (error.message !== "Unauthorized") {
      // Fallback for unexpected errors
      Toast("An unexpected error occurred");
  }
});
}
