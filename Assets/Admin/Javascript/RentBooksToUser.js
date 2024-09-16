
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




function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const userId = getQueryParameter('userId');
console.log(userId)

document.querySelectorAll('.nav-items a').forEach(link => {
  link.addEventListener('click', function() {
   
    window.location.href = `${this.getAttribute('data-href')}?userId=${userId}`;
  });
});

let selectedBookIds = new Set();

let allstocks = []; // Store all rents data
let filteredStocks = []; // Store filtered rents data


  // Apply all filters
  function applyFilters() {
    filteredStocks = allstocks.filter(stock => {
        return searchFilter(stock);
    });
    createRows(filteredStocks);
    updatePagination();
}



function searchFilter(stock) {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  return stock.book.title.toString().toLowerCase().includes(searchTerm) || stock.book.id.toString().toLowerCase().includes(searchTerm) ;
}

let currentPage = 1;
  const rowsPerPage = 10;
  
 // Update pagination
 function updatePagination() {
  const totalPages = Math.ceil(filteredStocks.length / rowsPerPage);
  const paginationContainer = document.querySelector('#pagination-container');
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

document.getElementById('searchInput').addEventListener('input', applyFilters);

// document.addEventListener('DOMContentLoaded', async  function() {

//     const stocks = await getStocks()
//     console.log(stocks)
//     populateRows(stocks);

//     const table = document.getElementById('customer-detail');
   
    
//     const rows = table.getElementsByTagName('tr');

//     for (let i = 0; i < rows.length; i++) {
//         rows[i].addEventListener('click', function() {
//             // Toggle classes for the clicked row
//             this.classList.toggle('hover-bg');
//             this.classList.toggle('active-bg');
//         });
//     }
// });

let createRows = (stocks)=>{
    rowHtml = "";
    stocks.forEach((stock,index) => {
      const isSelected = selectedBookIds.has(stock.book.id.toString());
        rowHtml+=`<tr
                        data-href="./UserRegularCartDetail.html"
                        data-id="${stock.bookId}"
                       class="${isSelected ? 'active-bg' : 'hover-bg'}"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse1"
                        aria-expanded="false"
                        aria-controls="collapseOne"
                      >
                        <td>${index+1}</td>

                        <td>${stock.book.title}</td>
                        <td class="">${stock.book.category}</td>
                        <td class="text-center">${stock.quantityInStock}</td>
                       
                        <td class="text-center">${stock.rentPerBook}</td>

                      </tr>`

    });

    const table = document.getElementById('table-detail');
    let tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = rowHtml

    addRowClickListeners();

}

function addRowClickListeners() {
  const table = document.getElementById('table-detail');
  const rows = table.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
      rows[i].addEventListener('click', function() {
          const bookId = this.getAttribute('data-id');
          if (selectedBookIds.has(bookId)) {
              selectedBookIds.delete(bookId);
              this.classList.remove('active-bg');
              this.classList.add('hover-bg');
          } else {
              selectedBookIds.add(bookId);
              this.classList.add('active-bg');
              this.classList.remove('hover-bg');
          }
      });
  }
}


let getStocks = () => {
  fetch(`http://localhost:5022/api/Book/ViewBooksForRent`,{
    method : "GET"
}).then(async(res)=> {
  
  if (!res.ok) {
    // For other error statuses, parse the error response
    const errorData = await res.json();
    throw errorData;
}
  
  return res.json()

})
.then((data)=>{
    console.log(data)
    createRows(data)

    allstocks = data
    filteredStocks = [...data]
    applyFilters()
   
    

}).catch((err)=>{
    console.log(err)
    // createErrorRow(err.message)
    Toast(err.message);

})


  }
getStocks()

  let submitData = ()=>{

    const bookIds = Array.from(selectedBookIds);

    let cartType = document.getElementById('CartType').value;

    console.log(cartType)
    fetch('http://localhost:5022/api/Rent/RentBooksToUser',{

      method : "POST",
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        "userId": userId,
        "cartType": cartType,
        "bookIds": bookIds
      })


    })
    .then(async(res)=> {
  
      if (!res.ok) {
        // For other error statuses, parse the error response
        const errorData = await res.json();
        throw errorData;
    }
      
      return res.json()
    
    })
    .then((data)=>{

      console.log(data)
     
      selectedBookIds.clear(); // Clear selections after submission
      Toast("Books Rented successfully")
      setTimeout(() => {
        window.location.reload();
    }, 1500); // Redirect after 1.5 seconds
    
    })
    .catch((err)=>{
      console.log(err)
      Toast(err.message);
      // createErrorRow(err.message)
    
    })


    console.log(bookIds)

  }