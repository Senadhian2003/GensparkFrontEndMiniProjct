const bookTitles = ["Sherlock Holmes", "Ben 10", "Learning React", "Harry Potter", "The Great Gatsby", "Pride and Prejudice"];

function populateDatalist(datalist) {
  bookTitles.forEach(title => {
    const option = document.createElement('option');
    option.value = title;
    datalist.appendChild(option);
  });
}

function updateTotal(row) {
  const priceInput = row.cells[2].children[0];
  const quantityInput = row.cells[3].children[0].children[1];
  const totalCell = row.cells[4];

  const price = parseFloat(priceInput.value) || 0;
  const quantity = parseInt(quantityInput.value) || 0;
  const total = price * quantity;

  totalCell.textContent = total.toFixed(2);
}

function handleInputChange(event) {
    const button = event.target;
    const row = button.closest('tr');
    const quantityInput = row.cells[3].children[0].children[1];
  
    if (button.matches('.minus')) {
      if (quantityInput.value > 0) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
      }
    } else if (button.matches('.plus')) {
      quantityInput.value = parseInt(quantityInput.value) + 1;
    }
  
    updateTotal(row);
  }

function addNewRow() {
  const table = document.getElementById('buy-sale-stock');
  const rows = table.getElementsByTagName('tr');
  const lastRow = rows[rows.length - 2];
  const newRowNumber = parseInt(lastRow.cells[0].textContent) + 1;
  const newRow = lastRow.cloneNode(true);

  newRow.cells[0].textContent = newRowNumber;
  newRow.cells[1].children[0].id = `${newRowNumber} title`;
  newRow.cells[2].children[0].id = `${newRowNumber} Price`;
  newRow.cells[3].children[0].children[0].id = `${newRowNumber} SubQuantity`;
  newRow.cells[3].children[0].children[1].id = `${newRowNumber} Quantity`;
  newRow.cells[3].children[0].children[2].id = `${newRowNumber} AddQuantity`;
  newRow.cells[4].id = `${newRowNumber} Total`;

  table.tBodies[0].appendChild(newRow);

  // Add event listeners for the new row
  const priceInput = newRow.cells[2].children[0]
  const minusButton = newRow.cells[3].children[0].children[0];
  const quantityInput = newRow.cells[3].children[0].children[1];
  const plusButton = newRow.cells[3].children[0].children[2];

  priceInput.addEventListener('input',handleInputChange)
  minusButton.addEventListener('click', handleInputChange);
  quantityInput.addEventListener('input', handleInputChange);
  plusButton.addEventListener('click', handleInputChange);
}

function handleRowClick(event) {
  const target = event.target;

  if (target.matches('input')) {
    const row = target.closest('tr');
    const table = row.parentNode.parentNode;
    const lastRow = table.tBodies[0].lastElementChild;

    if (row === lastRow) {
      addNewRow();
    }
  }
}

function createObjectsFromRows() {
    const table = document.getElementById('buy-sale-stock');
    const rows = table.getElementsByTagName('tr');
    const rowObjects = [];
    // console.log(rows)
    for (let i = 1; i <= rows.length - 2; i++) { 
      const row = rows[i];
      console.log(row)
      const bookName = row.cells[1].children[0].value;
      const price = parseFloat(row.cells[2].children[0].value);
      const quantity = parseInt(row.cells[3].children[0].children[1].value);
      const total = parseFloat(row.cells[4].textContent);

      if(!bookName || price==0 || !price || quantity==0 || !quantity){
        continue;
      }
  
      const rowObject = { bookName, price, quantity, total };
      rowObjects.push(rowObject);
    //   console.log(rowObject)
    }
  
    console.log(rowObjects);
  }


window.addEventListener('DOMContentLoaded', () => {
  const datalist = document.getElementById('Titles');
  populateDatalist(datalist);

  const tableBody = document.querySelector('#buy-sale-stock tbody');
  tableBody.addEventListener('click', handleRowClick);

  // Add event listeners for the initial row
  const firstRow = tableBody.firstElementChild;
  const priceInput = firstRow.cells[2].children[0]
  const minusButton = firstRow.cells[3].children[0].children[0];
  const quantityInput = firstRow.cells[3].children[0].children[1];
  const plusButton = firstRow.cells[3].children[0].children[2];

  priceInput.addEventListener('input',handleInputChange)
  minusButton.addEventListener('click', handleInputChange);
  quantityInput.addEventListener('input', handleInputChange);
  plusButton.addEventListener('click', handleInputChange);

  updateTotal(firstRow);
  const buyStockButton = document.querySelector('#submit-btn');
  buyStockButton.addEventListener('click', createObjectsFromRows);

});