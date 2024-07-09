console.log("Sale Books stock")


let allStocks = []
let filteredStocks = []
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

    filteredStocks = allStocks.filter((stock)=>{

        return searchFilter(stock) && categoryFilter(stock);
        

    })
    createRows(filteredStocks);
    updatePagination();
}

function searchFilter(stock){

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
    return stock.book.title.toLowerCase().includes(searchTerm) || stock.book.id.toString().toLowerCase().includes(searchTerm);
  
}

function categoryFilter(stock){

    let categoryValue = document.getElementById('categoryList').value;

    if(categoryValue=='All'){
        return true
    }
    else{
        return stock.book.category == categoryValue;
    }

}


document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('categoryList').addEventListener('change', applyFilters);

function updatePagination() {
    const totalPages = Math.ceil(filteredStocks.length / rowsPerPage);
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
                          data-id="${element.book.id}"
                          class="hover-bg"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse1"
                          aria-expanded="false"
                          aria-controls="collapseOne"
                        >
                          <td>${element.book.id}</td>

                          <td>${element.book.title}</td>
                          <td class="">${element.book.category}</td>
                          <td class="text-center">${element.pricePerBook}</td>
                          <td class="text-center">${element.quantityInStock}</td>
                        </tr>`


    });

    let tableBody = table.getElementsByTagName("tbody")[0];
    // console.log(innerHTMLContent)
    tableBody.innerHTML = innerHTMLContent;



}

function changePage(newPage) {
    currentPage = newPage;
    createRows(filteredStocks);
    updatePagination();
  }

fetch(`http://localhost:5022/api/Book/ViewBooksForSale`,{
    method : "GET"
}).then(res=> res.json())
.then((data)=>{
    console.log(data)
    allStocks = data
    filteredStocks = [...allStocks]
    applyFilters();
}).catch((err)=>{
    console.log(err.message)
    createErrorRow(err.message)

})