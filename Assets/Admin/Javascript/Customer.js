console.log("Customer page")

let allCustomers = []
let filteredCustomers = []
let currentPage = 1;
const rowsPerPage = 10;

function applyFilters(){

  filteredCustomers = allCustomers.filter((customer)=>{
    return searchFilter(customer) && statusFilter(customer) ;
  })
  createRows(filteredCustomers)
  updatePagination()

}

function searchFilter(customer){

  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  return customer.name.toLowerCase().includes(searchTerm);

}

function statusFilter(customer){
  const selectOption = document.getElementById('userType').value

  if(selectOption=='All'){
    return true
  }
  else if(selectOption=='Premium User'){
    return customer.role == "Premium User";
  }
  else{
    return customer.role == "User"
  }

}


document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('userType').addEventListener('change', applyFilters);


// Update pagination
function updatePagination() {
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
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



let createRows = (arr)=>{
    const table =  document.getElementById("customer-detail")

    let htmlStringContent = "";
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedArr = arr.slice(startIndex, endIndex);
    paginatedArr.forEach((element,index) => {
        
        htmlStringContent+=`<tr
                      data-href="./UserRegularCartDetail.html" data-id=${element.id}
                        class="hover-bg"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse1"
                        aria-expanded="false"
                        aria-controls="collapseOne"
                      >
                        <td>${index+1}</td>

                        <td>${element.name}</td>
                        <td class="">${element.phone}</td>
                        <td class="">${element.role}</td>

                        <td class=""> <p class="success">Active</p></td>

                        
                      </tr>`


    });

    const tableBody = table.getElementsByTagName("tbody")[0];
    tableBody.innerHTML = htmlStringContent;
    console.log(table);

  
    document.querySelectorAll('#customer-detail tbody tr').forEach(row => {
        row.addEventListener('click', function() {
          const userId = this.getAttribute('data-id');
          window.location.href = `${this.getAttribute('data-href')}?userId=${userId}`;
        });
      });
   


}

// Function to change page
function changePage(newPage) {
  currentPage = newPage;
  createRows(filteredFine);
  updatePagination();
}

fetch("http://localhost:5022/api/UserValidation/GetAllUsers",{
    method: "GET",
}).then((res)=>{
    console.log(res)
    return res.json();
}).then((data)=>{
    console.log(data)
    allCustomers = data
    filteredCustomers = [...allCustomers]
    applyFilters();
})





