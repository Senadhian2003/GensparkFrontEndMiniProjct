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

  let populatecategoriesList = (categories) => {
    const categoryList = document.getElementById('categoryList');
    categories.forEach(category => {
        let option = document.createElement('option');
        option.value = category; 
        option.textContent = category;
        categoryList.appendChild(option);
    });
};

let get_categories = async () => {
    try {
        let response = await fetch('http://localhost:5022/api/Book/GetUniqueCategories', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.json();
        populatecategoriesList(data);
    } catch (error) {
        console.error('Error:', error);
    }
};

get_categories()


console.log("Sales Books page")
let allCards = []
let filteredCards = []


function applyFilters() {
  console.log("Aplying filter")
  filteredCards = allCards.filter(card => {
      return priceFilter(card) && categoryFilter(card) && ratingFilter(card) && searchFilter(card);
  });
  applySorting(filteredCards);
  createCards(filteredCards);
  var myModalEl = document.getElementById('exampleModal');
  var modal = bootstrap.Modal.getInstance(myModalEl);
  modal.hide();
}


function clearFilters() {
  // Reset category
  document.getElementById('categoryList').value = 'All';

  // Reset price range
  const slider = document.getElementById('priceSlider');
  slider.noUiSlider.set([0, 10000]); // Assuming 0-10000 is your price range

  // Reset rating
  const ratingInputs = document.querySelectorAll('input[name="filter-rating"]');
  ratingInputs.forEach(input => input.checked = false);

  // Reset search input if you have one
  if (document.getElementById('searchInput')) {
    document.getElementById('searchInput').value = '';
  }

  // Reset filteredCards to show all cards
  filteredCards = [...allCards];

  // Apply sorting to all cards
  applySorting(filteredCards);

  // Recreate cards with all data
  createCards(filteredCards);

  // Close the modal
  var myModalEl = document.getElementById('exampleModal');
  var modal = bootstrap.Modal.getInstance(myModalEl);
  modal.hide();
}

function priceFilter(card){

    const minPrice = document.getElementById("minPrice").value
    const maxPrice = document.getElementById('maxPrice').value
    
    if(card.pricePerBook>minPrice && card.pricePerBook<maxPrice){
      return true
    }
    return false

}

function categoryFilter(card){
  
  const categoryValue = document.getElementById('categoryList').value;

  if(categoryValue == "All"){
    return true
  }
  else if(card.book.category==categoryValue){
    return true;
  }

  return false

}

function ratingFilter(card){
  const selectedRating = document.querySelector('input[name="filter-rating"]:checked');
    
    if (selectedRating) {
        const ratingValue = selectedRating.value;
    
        const avgBookRating = card.book.avgRating/card.book.ratingCount;
       
        if(avgBookRating>=ratingValue){
          console.log("SELECTED")
          return true
        }
        return false        
    } else {
        console.log("No rating selected");
        return true
    }
}


function searchFilter(card) {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  return card.book.title.toString().toLowerCase().includes(searchTerm) || 
  card.book.author.authorName.toLowerCase().includes(searchTerm) || card.book.category.toString().toLowerCase().includes(searchTerm);
}

document.getElementById('searchInput').addEventListener('input', applyFilters);


function applySorting(filteredCards) {
  const sort = document.getElementById('sort').value;
  console.log("filteredCards", filteredCards)
  if (sort == "name") {
    filteredCards.sort((a, b) => a.book.title.localeCompare(b.book.title));
  }
  else if (sort == "price-low-high") {
    filteredCards.sort((a, b) => a.pricePerBook - b.pricePerBook);
  }
  else if (sort == "price-high-low") {
    filteredCards.sort((a, b) => b.pricePerBook - a.pricePerBook);
  }
  else {
    // Sort by average rating (high to low)
    filteredCards.sort((a, b) => {
      const avgRatingA = a.book.ratingCount ? a.book.avgRating / a.book.ratingCount : 0;
      const avgRatingB = b.book.ratingCount ? b.book.avgRating / b.book.ratingCount : 0;
      return avgRatingB - avgRatingA;
    });
  }


  
}

document.getElementById('sort').addEventListener('change', applyFilters);




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
  Toast("Book added to cart");
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



fetch(`http://localhost:5022/api/Book/ViewBooksForSale`,{
    method : "GET"
}).then(res=> res.json())
.then((data)=>{
    console.log(data)
    allCards = data
    filteredCards = [...allCards]
    // createCards(filteredCards)
    applyFilters();
}).catch((err)=>{
    console.log(err.message)
    // createErrorRow(err.message)

})





