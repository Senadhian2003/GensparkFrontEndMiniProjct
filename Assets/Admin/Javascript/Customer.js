console.log("HIII")


let createRows = (arr)=>{
    const table =  document.getElementById("customer-detail")

    let htmlStringContent = "";

    arr.forEach((element,index) => {
        
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


fetch("http://localhost:5022/api/UserValidation/GetAllUsers",{
    method: "GET",
}).then((res)=>{
    console.log(res)
    return res.json();
}).then((data)=>{
    console.log(data)
    createRows(data);
})





