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

document.addEventListener('DOMContentLoaded', async  function() {

    const stocks = await getStocks()
    console.log(stocks)
    populateRows(stocks);

    const table = document.getElementById('customer-detail');
   
    
    const rows = table.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        rows[i].addEventListener('click', function() {
            // Toggle classes for the clicked row
            this.classList.toggle('hover-bg');
            this.classList.toggle('active-bg');
        });
    }
});

let populateRows = (stocks)=>{
    rowHtml = "";
    stocks.forEach((stock,index) => {
        
        rowHtml+=`<tr
                        data-href="./UserRegularCartDetail.html"
                        data-id="${stock.bookId}"
                        class="hover-bg"
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

    const table = document.getElementById('customer-detail');
    let tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = rowHtml

}

let getStocks = async () => {
    try {
      const response = await fetch('http://localhost:5022/api/Book/ViewBooksForRent', {
        method: "GET",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stocks:', error);
      return [];
    }
  }


  let submitData = ()=>{

    const table = document.getElementById('customer-detail');
   
    let bookIds = []
    const rows = table.querySelectorAll('tr.active-bg');

    rows.forEach(row => {
      bookId = row.getAttribute('data-id')
      bookIds.push(bookId);

    });

    let cartType = document.getElementById('CartType').value;


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
    .then(res=>res.json())
    .then((data)=>{

      console.log(data)


    })


    console.log(bookIds)

  }