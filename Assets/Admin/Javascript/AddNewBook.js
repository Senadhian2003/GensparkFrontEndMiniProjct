console.log("Add new Book Page")

let populateAuthorsList = (authors) => {
    const authorsList = document.getElementById('authorList');
    authors.forEach(author => {
        let option = document.createElement('option');
        option.value = author.id; 
        option.textContent = author.authorName; 
        authorsList.appendChild(option);
    });
};

let get_authors = async () => {
    try {
        let response = await fetch('http://localhost:5022/api/Book/GetAllAuthors', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.json();
        populateAuthorsList(data);
    } catch (error) {
        console.error('Error:', error);
    }
};

let populatecategoriesList = (categories) => {
    const categoryList = document.getElementById('categoryList');
    categories.forEach(category => {
        let option = document.createElement('option');
        option.value = category; 
        categoryList.appendChild(option);
    });
};

let get_categories = async () => {
    try {
        let response = await fetch('http://localhost:5022/api/Book/GetUniqueCategories', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.json();
        populatecategoriesList(data);
    } catch (error) {
        console.error('Error:', error);
    }
};

let populatePublishersList = (publishers) => {
    const publishersList = document.getElementById('publisherList');
    publishers.forEach(publisher => {
        let option = document.createElement('option');
        option.value = publisher.id; 
        option.textContent = publisher.publisherName; 
        publishersList.appendChild(option);
    });
};

let get_publishers = async () => {
    try {
        let response = await fetch('http://localhost:5022/api/Book/GetAllPUblishers', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.json();
        populatePublishersList(data);
    } catch (error) {
        console.error('Error:', error);
    }
};

get_authors();
get_categories();
get_publishers();

const AddAuthorBtn = document.getElementById("AddAuhtorBtn");
const addAuthorModal = new bootstrap.Modal(document.getElementById('addAuthorModal'));


AddAuthorBtn.addEventListener('click',()=>{

    let flag = validateName();   
    flag = validatePhoneNumber() && flag ;
    flag = validateAddress() && flag;
    if(flag){
        const name = document.querySelector("#newAuthorName").value;
        const phone = document.querySelector("#authorPhone").value;
        const address = document.querySelector("#authorAddress").value;

        fetch('http://localhost:5022/api/Book/AddNewAuthor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                    },
                body: JSON.stringify({
                    "authorName": name,
                    "phone": phone,
                    "address": address
                  })
            }).then((res)=>{
                return res.json()
            }).then((data)=>{
                console.log(data)
                alert("Author added successfully")
                clearAuthorForm()
                addAuthorModal.hide();
                get_authors()
            })


    }
    else{
        alert("Please enter all the details.")
    }



})


const AddPublisherBtn = document.getElementById("AddPublisherBtn");
const addPublisherModal = new bootstrap.Modal(document.getElementById('addPublisherModal'));


AddPublisherBtn.addEventListener('click',()=>{

    let flag = validatePublisherName();   
    flag = validateCity() && flag ;
    flag = validateState() && flag;
    flag = validateCountry() && flag;
    if(flag){
        const name = document.querySelector("#newPublisherName").value;
        const city = document.querySelector("#publisherCity").value;
        const state = document.querySelector("#publisherState").value;
        const country = document.querySelector("#publisherCountry").value;
        console.log(name, city, state, country)
        fetch('http://localhost:5022/api/Book/AddNewPublisher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                    },
                body: JSON.stringify({
                    "publisherName": name,
                    "city": city,
                    "state": state,
                    "country": country
                  })
            }).then((res)=>{
                return res.json()
            }).then((data)=>{
                console.log(data)
                alert("Publisher added successfully")
                clearPublisherForm()
                addPublisherModal.hide();
                get_publishers();
            })


    }
    else{
        alert("Please enter all the details.")
    }



})





let validateTitle = () =>{
    
    
    const title = document.querySelector("#bookTitle").value;
    const validationMessage = document.querySelector("#titleNameHelp");
    
    if (!title) {
        validationMessage.textContent = "Title cannot be empty";
        validationMessage.style.color = "red";
    }
    else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true
    }

}

let validateDescription = () =>{
    
    
    const description = document.querySelector("#bookDescription").value;
    const validationMessage = document.querySelector("#DescriptionNameHelp");
   
    if (!description) {
        validationMessage.textContent = "Description cannot be empty";
        validationMessage.style.color = "red";
    }
    else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true
    }

}


let validateCategory = () =>{
    
    
    const category = document.querySelector("#categoryName").value;
    const validationMessage = document.querySelector("#CategoryNameHelp");
    const containsNumbers = /\d/; 
    if (!category) {
        validationMessage.textContent = "Category cannot be empty";
        validationMessage.style.color = "red";
    }
    else if (containsNumbers.test(category)) {
validationMessage.textContent = "Title cannot contain numbers";
validationMessage.style.color = "red";
return false
} else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true
    }

}





let validateName = () =>{
    
    
    const name = document.querySelector("#newAuthorName").value;
    const validationMessage = document.querySelector("#authorNameHelp");
    const containsNumbers = /\d/; 
    if (!name) {
        validationMessage.textContent = "Name cannot be empty";
        validationMessage.style.color = "red";
    }
    else if (containsNumbers.test(name)) {
validationMessage.textContent = "Name cannot contain numbers";
validationMessage.style.color = "red";
return false
} else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true
    }

}


let validatePhoneNumber = () => {
    const phone = document.querySelector("#authorPhone").value;
    const validationMessage = document.querySelector("#phoneHelp");
    const phonePattern = /^\d{10}$/;

    if (!phone) {
        validationMessage.textContent = "Phone number cannot be empty";
        validationMessage.style.color = "red";
        return false
    } else if (!phonePattern.test(phone)) {
        validationMessage.textContent = "Phone number must be exactly 10 digits and contain no letters or symbols";
        validationMessage.style.color = "red";
        return false
    } else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true
    }
};


let validateAddress = () =>{
    
    
    const address = document.querySelector("#authorAddress").value;
    const validationMessage = document.querySelector("#authorAddressHelp");
   
    if (!address) {
        validationMessage.textContent = "Address cannot be empty";
        validationMessage.style.color = "red";
        return false
    }
    else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true
    }
   



}


function clearAuthorForm() {
    document.querySelector("#newAuthorName").value = '';
    document.querySelector("#authorPhone").value = '';
    document.querySelector("#authorAddress").value = '';
}

function clearPublisherForm(){

    document.querySelector("#newPublisherName").value = '';
    document.querySelector("#publisherCity").value = '';
    document.querySelector("#publisherState").value = '';
    document.querySelector("#publisherCountry").value = '';

}


let validatePublisherName = () =>{
    
    
    const name = document.querySelector("#newPublisherName").value;
    const validationMessage = document.querySelector("#publisherNameHelp");
    const containsNumbers = /\d/; 
    if (!name) {
        validationMessage.textContent = "Publisher Name cannot be empty";
        validationMessage.style.color = "red";
    }
    else if (containsNumbers.test(name)) {
validationMessage.textContent = "Publisher Name cannot contain numbers";
validationMessage.style.color = "red";
return false
} else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true
    }

}

let validateCity = () =>{
    
    
    const name = document.querySelector("#publisherCity").value;
    const validationMessage = document.querySelector("#publisherCityHelp");
    const containsNumbers = /\d/; 
    if (!name) {
        validationMessage.textContent = "City Name cannot be empty";
        validationMessage.style.color = "red";
    }
    else if (containsNumbers.test(name)) {
validationMessage.textContent = "City Name cannot contain numbers";
validationMessage.style.color = "red";
return false
} else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true
    }

}

let validateState = () =>{
    
    
    const name = document.querySelector("#publisherState").value;
    const validationMessage = document.querySelector("#publisherStateHelp");
    const containsNumbers = /\d/; 
    if (!name) {
        validationMessage.textContent = "State Name cannot be empty";
        validationMessage.style.color = "red";
    }
    else if (containsNumbers.test(name)) {
validationMessage.textContent = "State Name cannot contain numbers";
validationMessage.style.color = "red";
return false
} else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true
    }

}

let validateCountry = () =>{
    
    
    const name = document.querySelector("#publisherCountry").value;
    const validationMessage = document.querySelector("#publisherCountryHelp");
    const containsNumbers = /\d/; 
    if (!name) {
        validationMessage.textContent = "Country Name cannot be empty";
        validationMessage.style.color = "red";
    }
    else if (containsNumbers.test(name)) {
validationMessage.textContent = "Country Name cannot contain numbers";
validationMessage.style.color = "red";
return false
} else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true
    }

}

function validateAuthorSelect() {
    const authorSelect = document.querySelector("#authorList");
    const validationMessage = document.querySelector("#authorSelectHelp");

    if (authorSelect.value === "") {
        validationMessage.textContent = "Please select an author name";
        validationMessage.style.color = "red";
        return false;
    } else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true;
    }
}

function validatePublisherSelect() {
    const publisherSelect = document.querySelector("#publisherList");
    const validationMessage = document.querySelector("#publisherSelectHelp");

    if (publisherSelect.value === "") {
        validationMessage.textContent = "Please select a Publisher name";
        validationMessage.style.color = "red";
        return false;
    } else {
        validationMessage.textContent = "Accepted";
        validationMessage.style.color = "green";
        return true;
    }
}