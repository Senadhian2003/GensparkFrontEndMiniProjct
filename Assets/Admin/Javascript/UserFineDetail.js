console.log("User Fine Detail page")


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


document.querySelectorAll('.nav-items a').forEach(link => {
  link.addEventListener('click', function() {
   
    window.location.href = `${this.getAttribute('data-href')}?userId=${userId}`;
  });
});

let allFine = []; // Store all Fines data
let filteredFine = []; // Store filtered Fine data


fetch(`http://localhost:5022/api/Fine/ViewAllFines`,{
  method : "GET"
}).then(res=> res.json())
.then((data)=>{
  console.log(data)
  allFine = Array.isArray(data) ? data : [];
  filteredFine = [...allFine]
  applyFilters();
  

})


// Apply all filters
function applyFilters() {
  filteredFine = allFine.filter(Fine => {
      return dateFilter(Fine) && pendingFinesFilter(Fine) && searchFilter(Fine);
  });
  createRows(filteredFine);
  updatePagination();
}

// Date filter
function dateFilter(Fine) {
  const fromDate = document.getElementById('fromDate').value;
  const toDate = document.getElementById('toDate').value;
  const fineDate = new Date(Fine.rentDate);

  if (fromDate && new Date(fromDate) > fineDate) return false;
  if (toDate && new Date(toDate) < fineDate) return false;
  return true;
}

// Fine Pending return filter
function pendingFinesFilter(Fine) {
  const pendingSwitch = document.getElementById('pendingReturnSwitch');
  return !pendingSwitch.checked || Fine.numbeOfBooksToPayFine > 0;
}

// Search filter
function searchFilter(Fine) {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  return Fine.rentId.toString().toLowerCase().includes(searchTerm);
}

// Event listeners for filters
document.getElementById('fromDate').addEventListener('change', applyFilters);
document.getElementById('toDate').addEventListener('change', applyFilters);
document.getElementById('pendingReturnSwitch').addEventListener('change', applyFilters);
document.getElementById('searchInput').addEventListener('input', applyFilters);

// Pagination variables
let currentPage = 1;
const rowsPerPage = 10;

// Update pagination
function updatePagination() {
  const totalPages = Math.ceil(filteredFine.length / rowsPerPage);
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

function payFine(fineId, bookId){

  console.log(fineId, bookId)

  fetch('http://localhost:5022/api/Fine/PayFineForOneBook', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
            },
        body: JSON.stringify({
          "fineId": fineId,
          "bookId": bookId
        })
    }).then(async(res)=> {
  
      if (!res.ok) {
        // For other error statuses, parse the error response
        const errorData = await res.json();
        throw errorData;
    }
      
      return res.json()
    
    }).then((data)=>{
        console.log(data)
        Toast("Fine Paid successfully")
        setTimeout(() => {
          window.location.reload();
      }, 1500); // Redirect after 1.5 seconds
    })
    .catch((err)=>{
      console.log(err)
      Toast(err.message);
      // createErrorRow(err.message)
    
    })


}


let createRows = (arr)=>{

    const table = document.getElementById("table-detail");
    let innerHTMLContent = "";

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedArr = arr.slice(startIndex, endIndex);

    paginatedArr.forEach((element,index) => {
        
        innerHTMLContent+=`  <tr class="hover-bg"  data-bs-toggle="collapse" data-bs-target="#collapse${index+1}" aria-expanded="false" aria-controls="collapseOne">
                        <td>${element.rentId}</td>
                     

                        
                        <td class="text-center">${element.rentDate.slice(0,10)}</td>
                        <td class="text-center">${element.numberOfBooksFined}</td>
                        
                        <td class="text-center">${element.numbeOfBooksToPayFine}</td>
                        
                        <td class="text-center">${element.fineAmount}</td>
                        <td class="text-center">${element.finePending}</td>
                      </tr>
                      `
        let rentDetailList = element.fineDetailsList;

        let rentDetailHtmlContent = `<tr>
                        <td colspan="7" class="p-0">
                          <div id="collapse${index+1}" class="collapse" data-bs-parent="#table-detail" >
                            <table class="table poppins-medium Detail mb-0" style="font-size: 14px">
                              <thead>
                                <tr>
                                  <td scope="col">Book ID</td>
                                  <td scope="col">Fine Amount</td>
                                  <td class="text-center" scope="col">Fine Paid Date</td>
                                  <td  scope="col">Status</td>
                                </tr>
                              </thead>
                              <tbody>`;
        
        rentDetailList.forEach(rentDetail => {
            console.log(rentDetail)
            rentDetailHtmlContent+=`<tr>
                                  <td>${rentDetail.bookId}</td> 
                                  <td>${rentDetail.fineAmount}</td>
                                  <td class="text-center" >${rentDetail.finePaidDate? rentDetail.finePaidDate.slice(0,10):'-'}</td>
                                  `

                                  if(rentDetail.status == "Fine paid"){
                                    rentDetailHtmlContent+=` <td><p class="success">${rentDetail.status}</p></td>`
                                  }
                                  else{
                                     rentDetailHtmlContent+=` <td><p style="cursor : pointer" onclick="payFine(${element.fineId}, ${rentDetail.bookId})" class="danger">${rentDetail.status}</p></td>`
                                  }
                            
                  rentDetailHtmlContent+=`</tr>`

        });

        rentDetailHtmlContent+=`</tbody>
                            </table>
                          </div>
                        </td>
                      </tr>`

        innerHTMLContent+=rentDetailHtmlContent



    });

    let tableBody = table.getElementsByTagName("tbody")[0];
    // console.log(innerHTMLContent)
    tableBody.innerHTML = innerHTMLContent;



}


// Function to change page
function changePage(newPage) {
  currentPage = newPage;
  createRows(filteredFine);
  updatePagination();
}

// Initial call to set up the table
applyFilters();
