console.log("Elite Cart page")

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



fetch(`http://localhost:5022/api/Cart/ViewSuperRentCartItems?userId=${userId}`,{
    method : "Get"
}).then(res=> res.json())
.then((data)=>{
    console.log(data)
    createRows(data)
})