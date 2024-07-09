const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQcmVtaXVtIFVzZXIiLCJleHAiOjE3MjA2Nzk3ODB9.YG44-Jb08ZQPzUwSk6zM_d3tOd-9S0qbeJlTb7g-BrY'




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
    
    rating.innerHTML = `<span class="rating-count" style="color: black">${avgRating?avgRating:'0.0'}</span>
              <span class="fa fa-star" id="1"></span>
              <span class="fa fa-star" id="2"></span>
              <span class="fa fa-star" id="3"></span>
              <span class="fa fa-star" id="4"></span>
              <span class="fa fa-star" id="5"></span>
              <span style="font-size: 14px; color: black">(${stock.book.ratingCount})</span>`

    price.textContent = '$ ' + stock.pricePerBook;
    content.textContent = stock.book.description;
    stock_content.textContent = stock.quantityInStock + ' books in stock'
    applyRatings()
}

function populateFeedbackData(feedbackData){

    let splitRating = document.getElementById('splitRating')
    splitRating.innerHTML = `<span class="rating-count" style="color: black"
                                  >${feedbackData.averageRating}</span
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
                  style="width: ${feedbackData.fiveStarPercentage}%"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                ${feedbackData.fiveStarPercentage}%
                </div>
              </div>

              <div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  style="width: ${feedbackData.fourStarPercentage}%"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                ${feedbackData.fourStarPercentage}%
                </div>
              </div>

              <div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  style="width: ${feedbackData.threeStarPercentage}%"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                 ${feedbackData.threeStarPercentage}%
                </div>
              </div>

              <div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  style="width: ${feedbackData.twoStarPercentage}%"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                 ${feedbackData.twoStarPercentage}%
                </div>
              </div>

              <div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  style="width: ${feedbackData.oneStarPercentage}%"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                 ${feedbackData.oneStarPercentage}%
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

  
  fetch(`http://localhost:5022/api/Book/ViewSaleBookDetail?bookId=${bookId}`,{
    method : "GET"
}).then(res=> res.json())
.then((data)=>{
    console.log(data)
    populateBookdata(data);
   
}).catch((err)=>{
    console.log(err.message)
    createErrorRow(err.message)

})


fetch(`http://localhost:5022/api/Book/ViewFeedback?BookId=${bookId}`,{
    method : "GET"
}).then(res=> res.json())
.then((data)=>{
    console.log(data)

    populateFeedbackData(data)
   
   
}).catch((err)=>{
    console.log(err.message)
    createErrorRow(err.message)

})


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
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Failed to add item to cart");
  });
}
