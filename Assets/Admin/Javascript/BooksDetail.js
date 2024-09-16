console.log("Books stock")


function  Toast(message){

    var myToast = Toastify({
        text: message,
        duration: 1000
       })
       myToast.showToast();
  
  }
  
  
  const userToken = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  
  
  if(!userToken){
    Toast("Login Requited")
    setTimeout(() => {
      window.location.href = '../User/login.html';
  }, 1500); // Redirect after 1.5 seconds
  }
  
  
  if(userRole!="Admin"){
    Toast("Unauthorized access....")
    setTimeout(() => {
      window.location.href = '../User/login.html';
  }, 1500); // Redirect after 1.5 seconds
  }
  
  
  
  
  
  
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    Toast("Logged out successfully");
    setTimeout(() => {
        window.location.href = '../User/login.html';
    }, 1500); // Redirect after 1.5 seconds
  }
  
  


let allBooks = []
let filteredBooks = []
let currentPage = 1;
const rowsPerPage = 10;


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
        console.log(data)
        populatecategoriesList(data);
    } catch (error) {
        console.error('Error:', error);
    }
};

get_categories()


function applyFilters(){

    filteredBooks = allBooks.filter((book)=>{

        return searchFilter(book) && categoryFilter(book);
        

    })
    createRows(filteredBooks);
    updatePagination();
}

function searchFilter(book){

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
    return book.title.toLowerCase().includes(searchTerm) || book.author.authorName.toLowerCase().includes(searchTerm)
    || book.publisher.publisherName.toLowerCase().includes(searchTerm) || book.id.toString().toLowerCase().includes(searchTerm);
  
}

function categoryFilter(book){

    let categoryValue = document.getElementById('categoryList').value;

    if(categoryValue=='All'){
        return true
    }
    else{
        return book.category == categoryValue;
    }

}


document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('categoryList').addEventListener('change', applyFilters);

function updatePagination() {
    const totalPages = Math.ceil(filteredBooks.length / rowsPerPage);
    const paginationContainer = document.querySelector('.pagination-container');
    let paginationHTML = '';
  
    // Show ellipsis if there are many pages
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
    if (startPage > 1) {
      paginationHTML += `<span class="pagination" onclick="changePage(1)">1</span>`;
      if (startPage > 2) {
        paginationHTML += `<span class="pagination-ellipsis">...</span>`;
      }
    }
  
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `<span class="pagination ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</span>`;
    }
  
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="pagination-ellipsis">...</span>`;
      }
      paginationHTML += `<span class="pagination" onclick="changePage(${totalPages})">${totalPages}</span>`;
    }
  
    paginationContainer.innerHTML = paginationHTML;
  
    // Disable arrows if at first or last page
    document.querySelector('.pagination-arrow:first-child').classList.toggle('disabled', currentPage === 1);
    document.querySelector('.pagination-arrow:last-child').classList.toggle('disabled', currentPage === totalPages);
  }


let createErrorRow = (errorMessage)=>{
    console.log(errorMessage)
    const table = document.getElementById("table-detail");
    let innerHTMLContent = ` <tr
                        
                        
                      >
                        <td colspan=4>${errorMessage}</td>

                        
                       
                      </tr>`;
    let tableBody = table.getElementsByTagName("tbody")[0];
    tableBody.innerHTML = innerHTMLContent;

}


let createRows = (arr)=>{

    const table = document.getElementById("table-detail");
    let innerHTMLContent = "";

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedArr = arr.slice(startIndex, endIndex);

    paginatedArr.forEach((element,index) => {
        
        
        
        

        innerHTMLContent+=` <tr
                        data-href="./UserRegularCartDetail.html"
                        data-id="${element.id}"
                        class="hover-bg"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse1"
                        aria-expanded="false"
                        aria-controls="collapseOne"
                      >
                        <td>${element.id}</td>

                        <td>${element.title}</td>
                        <td class="">${element.category}</td>
                        <td class="">${element.author.authorName} Lee</td>
                        <td class="">${element.publisher.publisherName} Lee</td>

                      </tr>`


    });

    let tableBody = table.getElementsByTagName("tbody")[0];
    // console.log(innerHTMLContent)
    tableBody.innerHTML = innerHTMLContent;



}

// Function to change page
function changePage(newPage) {
    currentPage = newPage;
    createRows(filteredBooks);
    updatePagination();
  }

fetch(`http://localhost:5022/api/Book/ViewAllBookDetails`,{
    method : "GET"
}).then(res=> res.json())
.then((data)=>{
    console.log(data)
    allBooks = data
    filteredBooks = [...allBooks]
    applyFilters();
    // createRows(data)

}).catch((err)=>{
    console.log(err.message)
    createErrorRow(err.message)

})




