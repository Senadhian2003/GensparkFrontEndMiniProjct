//Hamburger Effect
const hamburger = document.querySelector(".toggle-btn");

hamburger.addEventListener("click",function(){
    document.querySelector("#sidebar").classList.toggle("expand");
    document.querySelector(".main").classList.toggle("expand");
})


//Selected Effect for dashboard item

// const sidebarLinks = document.querySelectorAll('.sidebar-link');

// sidebarLinks.forEach(link => {
//     link.addEventListener('click', function(e) {
//       e.preventDefault(); // Prevent the default link behavior
  
//       // Remove the 'active' class from all links
//       sidebarLinks.forEach(link => link.classList.remove('active'));
  
//       // Add the 'active' class to the clicked link
//       this.classList.add('active');
//     });
//   });

// Nav Link Colors

// const navLinks = document.querySelectorAll('.nav-link');
// navLinks.forEach(link => {
//   link.addEventListener('click', function(e) {
//     // e.preventDefault(); // Prevent the default link behavior
//     console.log(navLinks)
//     // Remove the 'active' class from all links
//     navLinks.forEach(link => link.classList.remove('active'));

//     // Add the 'active' class to the clicked link
//     this.classList.add('active');
//   });
// });

