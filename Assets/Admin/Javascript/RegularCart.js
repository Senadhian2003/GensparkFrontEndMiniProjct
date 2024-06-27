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

    arr.forEach((element,index) => {
        
        innerHTMLContent+=` <tr
                        
                        
                      >
                        <td>${element.book.id}</td>

                        
                        <td>${element.book.title}</td>
                        <td class="text-center">${element.rentId}</td>
                        <td class="text-center">${element.rentDate.slice(0,10)}</td>
                        <td class="text-center">${element.dueDate.slice(0,10)}</td>
                       
                       
                        <td class="text-center"><button class="btn return-btn" >Return</button></td>
                      </tr>`

    });

    let tableBody = table.getElementsByTagName("tbody")[0];
    // console.log(innerHTMLContent)
    tableBody.innerHTML = innerHTMLContent;



}



fetch(`http://localhost:5022/api/Cart/ViewRentCartItems?userId=${userId}`,{
    method : "GET"
}).then(res=> res.json())
.then((data)=>{
    console.log(data)
    createRows(data)
}).catch((err)=>{
    console.log(err.message)
    createErrorRow(err.message)

})