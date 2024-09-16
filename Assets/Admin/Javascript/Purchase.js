console.log("Purchase page")


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




let allPurchases = []
let filteredPurchases = []
let currentPage = 1;
const rowsPerPage = 10;


function applyFilters(){

  filteredPurchases = allPurchases.filter((purchase)=>{

      return typeFilter(purchase) && dateFilter(purchase);
      

  })
  createRows(filteredPurchases);
  updatePagination();
}

function typeFilter(purchase){

  let typeValue = document.getElementById('typeList').value;

    if(typeValue=='All'){
        return true
    }
    else{
        return purchase.type == typeValue;
    }

}

function dateFilter(purchase){
  const fromDate = document.getElementById('fromDate').value;
  const toDate = document.getElementById('toDate').value;
  const purchaseDate = new Date(purchase.dateOfPurchase);

  if (fromDate && new Date(fromDate) > purchaseDate) return false;
  if (toDate && new Date(toDate) < purchaseDate) return false;
  return true;
}

document.getElementById('typeList').addEventListener('change', applyFilters);
document.getElementById('fromDate').addEventListener('change', applyFilters);
document.getElementById('toDate').addEventListener('change', applyFilters);


function updatePagination() {
  const totalPages = Math.ceil(filteredPurchases.length / rowsPerPage);
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



// let createErrorRow = (errorMessage)=>{
//     console.log(errorMessage)
//     const table = document.getElementById("table-detail");
//     let innerHTMLContent = ` <tr
                        
                        
//                       >
//                         <td colspan=4>${errorMessage}</td>

                        
                       
//                       </tr>`;
//     let tableBody = table.getElementsByTagName("tbody")[0];
//     tableBody.innerHTML = innerHTMLContent;

// }


let createRows = (arr)=>{

    const table = document.getElementById("table-detail");
    let innerHTMLContent = "";
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedArr = arr.slice(startIndex, endIndex);

    paginatedArr.forEach((element,index) => {
        
        innerHTMLContent+=` <tr
                        class="hover-bg"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse${index+1}"
                        aria-expanded="false"
                        aria-controls="collapseOne"
                      >
                        <td>${element.purchaseId}</td>

                        
                        
                        <td>${element.dateOfPurchase.slice(0,10)}</td>
                        <td class="text-center">${element.type}</td>
                        <td class="text-center">${element.purchaseDetailsList.length}</td>
                        
                        <td class="text-center">${element.amount}</td>
                      </tr>
                      `
        let rentDetailList = element.purchaseDetailsList;

        let rentDetailHtmlContent = `<tr>
                        <td colspan="7" class="p-0">
                          <div
                            id="collapse${index+1}"
                            class="collapse"
                            data-bs-parent="#table-detail"
                          >
                            <table
                              class="table poppins-medium Detail mb-0"
                              style="font-size: 14px"
                            >
                              <thead>
                                <tr>
                                  <td scope="col">Book ID</td>
                                  <td scope="col">Book Name</td>
                                  <td class="text-center" scope="col">
                                    Price Per Book
                                  </td>
                                  <td scope="col">Quantity</td>
                                  <td scope="col">Total</td>
                                </tr>
                              </thead>
                              <tbody>`;
        
        rentDetailList.forEach(rentDetail => {
            console.log(rentDetail)
            rentDetailHtmlContent+=`<tr>
                                  <td>${rentDetail.book.id}</td>
                                  <td>${rentDetail.book.title}</td>
                                  <td class="text-center">${rentDetail.pricePerBook}</td>
                                  <td class="text-center">${rentDetail.quantity}</td>
                                  <td class="text-center">${rentDetail.totalPrice }</td>
                                </tr>`

        });

        rentDetailHtmlContent+=` </tbody>
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
  createRows(filteredPurchases);
  updatePagination();
}


fetch(`http://localhost:5022/api/Purchase/ViewPurchases`,{
    method : "GET"
}).then(res=> res.json())
.then((data)=>{
    console.log(data)
    allPurchases = data
    filteredPurchases = [...data]
    applyFilters();
}).catch((err)=>{
    console.log(err)
    // createErrorRow(err.message)

})