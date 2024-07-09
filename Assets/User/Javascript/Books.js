  const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQcmVtaXVtIFVzZXIiLCJleHAiOjE3MjA2Nzk3ODB9.YG44-Jb08ZQPzUwSk6zM_d3tOd-9S0qbeJlTb7g-BrY'

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

  const slider = document.getElementById("priceSlider");
  const minInput = document.getElementById("minPrice");
  const maxInput = document.getElementById("maxPrice");

  noUiSlider.create(slider, {
    start: [0, 10000],
    connect: true,
    range: {
      min: 0,
      max: 10000,
    },
    step: 1,
  });

  slider.noUiSlider.on("update", function (values, handle) {
    const value = Math.round(values[handle]);
    if (handle === 0) {
      minInput.value = value;
    } else {
      maxInput.value = value;
    }
  });

  function setSliderValues() {
    slider.noUiSlider.set([minInput.value, maxInput.value]);
  }

  minInput.addEventListener("change", setSliderValues);
  maxInput.addEventListener("change", setSliderValues);


console.log("Sales Books page")
let allCards = []
let filteredCards = []

let createCards = (arr)=>{

    const cardsDivision = document.getElementById("book-cards");
    let innerHTMLContent = "";

    // const startIndex = (currentPage - 1) * rowsPerPage;
    // const endIndex = startIndex + rowsPerPage;
    // const paginatedArr = arr.slice(startIndex, endIndex);

    arr.forEach((element,index) => {
        
        
        let avgRating = element.book.avgRating/element.book.ratingCount;
        

        innerHTMLContent+=` <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <a href="./BookDetail.html" class="book-card-link" data-book-id="${element.bookId}">
              <div class="card book-card">
                <img
                  src="${element.book.image 
                        ? `data:image/jpeg;base64,${element.book.image}`
                        : '../../Assets/User/Images/BookCover.avif'}"
                  class="card-img-top"
                  alt="Book Cover"
                />
                <div class="card-body">
                  <h5 class="card-title">${element.book.title}</h5>
                  <p class="card-category" style="margin-bottom: 5px">${element.book.category}</p>
                  <p class="card-text" style="margin-bottom: 5px">${element.book.author.authorName}</p>
                  <div class="rating">
                    <span class="rating-count" style="display: none">${avgRating}</span>
                    <span class="fa fa-star" id="1"></span>
                    <span class="fa fa-star" id="2"></span>
                    <span class="fa fa-star" id="3"></span>
                    <span class="fa fa-star" id="4"></span>
                    <span class="fa fa-star" id="5"></span>
                    <span style="font-size: 14px">(10)</span>
                  </div>
                  <p class="card-text"> $ ${element.pricePerBook}</p>
                    </a>
                  <button class="btn btn-primary" onclick='AddBookToCart(${element.bookId},1)'>Add to Cart</button>
                </div>
              </div>
            
            </div>`


    });

   
    cardsDivision.innerHTML = innerHTMLContent;
    

    const cardLinks = document.querySelectorAll('.book-card-link');
    cardLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            const bookId = this.getAttribute('data-book-id');
            window.location.href = `./BookDetail.html?id=${bookId}`;
        });
    });

    applyRatings()

}


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
.then(response => response.json())
.then((data) => {console.log(data)
  alert("Item added to cart")
})
.catch(error => console.error('Error:', error));


}



fetch(`http://localhost:5022/api/Book/ViewBooksForSale`,{
    method : "GET"
}).then(res=> res.json())
.then((data)=>{
    console.log(data)
    allCards = data
    filteredCards = [...allCards]
    createCards(filteredCards)
    // applyFilters();
}).catch((err)=>{
    console.log(err.message)
    createErrorRow(err.message)

})





