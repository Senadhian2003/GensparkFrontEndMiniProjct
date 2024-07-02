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
                          <div id="collapse1" class="collapse" data-bs-parent="#table-detail" >
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
                                  <td class="text-center" >${rentDetail.finePaidDate.slice(0,10)}</td>
                                  <td><p  class="success">${rentDetail.status}</p></td>
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
    // console.log(innerHTMLContent)
    tableBody.innerHTML = innerHTMLContent;



}



fetch(`http://localhost:5022/api/Fine/ViewFines?userId=${userId}`,{
    method : "GET"
}).then(res=> res.json())
.then((data)=>{
    console.log(data)
    createRows(data)
}).catch((err)=>{
    console.log(err.message)
    // createErrorRow(err.message)

})