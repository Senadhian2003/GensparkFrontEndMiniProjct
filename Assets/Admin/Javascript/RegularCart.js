console.log("Regular Cart page")


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

  let selectedBookIds = new Set();

  const userId = getQueryParameter('userId');


document.querySelectorAll('.nav-items a').forEach(link => {
    link.addEventListener('click', function() {
     
      window.location.href = `${this.getAttribute('data-href')}?userId=${userId}`;
    });
  });

  let allCartItems = []; // Store all rents data
  let filteredCartItems = []; // Store filtered rents data

  // Apply all filters
  function applyFilters() {
    filteredCartItems = allCartItems.filter(cartItem => {
        return searchFilter(cartItem);
    });
    createRows(filteredCartItems);
    updatePagination();
}

function searchFilter(cartItem) {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  return cartItem.book.title.toString().toLowerCase().includes(searchTerm) || cartItem.book.id.toString().toLowerCase().includes(searchTerm) ;
}

let currentPage = 1;
  const rowsPerPage = 10;
  
  // Update pagination
  function updatePagination() {
    const totalPages = Math.ceil(filteredCartItems.length / rowsPerPage);
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
                        <td colspan=5 class="text-center"><img src="../../Assets/Admin/Images/emptyData.png" alt=""></td>

                        
                       
                      </tr>`;
    let tableBody = table.getElementsByTagName("tbody")[0];
    tableBody.innerHTML = innerHTMLContent;

}

document.getElementById('searchInput').addEventListener('input', applyFilters);

function submitData() {
  const bookIds = Array.from(selectedBookIds);
  console.log(userId, bookIds);

  fetch('http://localhost:5022/api/Rent/ReturnRentedBooks', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "userId": userId,
          "bookIds": bookIds
      })
  })
  .then(res => res.json())
  .then((data) => {
      console.log(data);
      selectedBookIds.clear(); // Clear selections after submission
      Toast("Book Returned Successfully")
      ViewRentCartItems();
  });
}

let createRows = (arr)=>{

    const table = document.getElementById("table-detail");
    let innerHTMLContent = "";

    arr.forEach((element,index) => {
      const isSelected = selectedBookIds.has(element.book.id.toString());
        innerHTMLContent+=` <tr
                        class="${isSelected ? 'active-bg' : 'hover-bg'}"
                          data-id="${element.book.id}"
                      >
                        <td>${element.book.id}</td>

                        
                        <td>${element.book.title}</td>
                        <td class="text-center">${element.rentId}</td>
                        <td class="text-center">${element.rentDate.slice(0,10)}</td>
                        <td class="text-center">${element.dueDate.slice(0,10)}</td>
                      </tr>`

    });

    let tableBody = table.getElementsByTagName("tbody")[0];
    // console.log(innerHTMLContent)
    tableBody.innerHTML = innerHTMLContent;

    // hoverEffect()
    addRowClickListeners();

}

// function hoverEffect(){
//   const table = document.getElementById('table-detail');
   
    
//     const rows = table.getElementsByTagName('tr');

//     for (let i = 0; i < rows.length; i++) {
//         rows[i].addEventListener('click', function() {
//             // Toggle classes for the clicked row
//             this.classList.toggle('hover-bg');
//             this.classList.toggle('active-bg');
//         });
//     }
// }


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



function ViewRentCartItems(){
  fetch(`http://localhost:5022/api/Cart/ViewRentCartItems?userId=${userId}`,{
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
    

    allCartItems = data
    filteredCartItems = [...data]
    applyFilters()
   
    

}).catch((err)=>{
    console.log(err)
    Toast(err.message);
    createErrorRow(err.message)

})


}

ViewRentCartItems()

