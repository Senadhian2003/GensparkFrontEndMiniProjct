console.log("Regular Cart page")

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

  let allRents = []; // Store all rents data
  let filteredRents = []; // Store filtered rents data
  
  // Fetch and initialize data
  fetch(`http://localhost:5022/api/Sale/ViewRents?userId=${userId}`,{
    method : "GET"
}).then(res=> res.json())
.then((data)=>{
    console.log(data)
    allRents = data
    filteredRents = [...data]
    applyFilters()
    
}).catch((err)=>{
    console.log(err.message)
    createErrorRow(err.message)

})
  // Apply all filters
  function applyFilters() {
      filteredRents = allRents.filter(rent => {
          return dateFilter(rent) && pendingReturnFilter(rent) && searchFilter(rent);
      });
      createRows(filteredRents);
      updatePagination();
  }
  
  // Date filter
  function dateFilter(rent) {
      const fromDate = document.getElementById('fromDate').value;
      const toDate = document.getElementById('toDate').value;
      const rentDate = new Date(rent.dateOfRent);
  
      if (fromDate && new Date(fromDate) > rentDate) return false;
      if (toDate && new Date(toDate) < rentDate) return false;
      return true;
  }
  
  // Pending return filter
  function pendingReturnFilter(rent) {
      const pendingSwitch = document.getElementById('pendingReturnSwitch');
      return !pendingSwitch.checked || rent.booksToBeReturned > 0;
  }
  
  // Search filter
  function searchFilter(rent) {
      const searchTerm = document.getElementById('searchInput').value.toLowerCase();
      return rent.rentId.toString().toLowerCase().includes(searchTerm);
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
    const totalPages = Math.ceil(filteredRents.length / rowsPerPage);
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
  
  // Create rows with pagination
  function createRows(arr) {
      const table = document.getElementById("table-detail");
      let innerHTMLContent = "";
  
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const paginatedArr = arr.slice(startIndex, endIndex);
  
      paginatedArr.forEach((element, index) => {
        innerHTMLContent+=` <tr
        class="hover-bg"
        data-bs-toggle="collapse"
        data-bs-target="#collapse${index+1}"
        aria-expanded="false"
        
      >
        <td>${element.rentId}</td>
       
        
        <td>${element.cartType}</td>
        <td>${element.dateOfRent.slice(0,10)}</td>
        <td>${element.dueDate.slice(0,10)}</td>
        <td class="text-center">${element.booksRented}</td>
        <td class="text-center">${element.booksToBeReturned}</td>
        <td class="text-center">${element.amount}</td>
      </tr>
      `
  let rentDetailList = element.rentDetailsList;
  
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
                  <td scope="col">Price</td>
                  <td class="text-center" scope="col">
                    Return Date
                  </td>
                  <td scope="col">Status</td>
                </tr>
              </thead>
              <tbody>`;
  
  rentDetailList.forEach(rentDetail => {
  console.log(rentDetail)
  rentDetailHtmlContent+=`<tr>
                  <td>${rentDetail.bookId}</td>
                  <td>${rentDetail.price}</td>
                  <td class="text-center">${rentDetail.returnDate.slice(0,10)}</td>
                  <td><p class="success">${rentDetail.status}</p></td>
                </tr>`
  
  });
  
  rentDetailHtmlContent+=`</tbody>
            </table>
          </div>
        </td>
      </tr>`
  
  innerHTMLContent+=rentDetailHtmlContent
  
  
      });
  
      let tableBody = table.getElementsByTagName("tbody")[0];
      tableBody.innerHTML = innerHTMLContent;
  }
  
  // Function to change page
  function changePage(newPage) {
      currentPage = newPage;
      createRows(filteredRents);
      updatePagination();
  }
  
  // Initial call to set up the table
  applyFilters();