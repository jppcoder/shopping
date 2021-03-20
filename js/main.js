//CREAMOS LAS VARIABLES

const courses = document.querySelector('#courses-list'),
    
    shoppingCartContent = document.querySelector('#cart-content tbody'),
    
    clearCartBtn = document.querySelector('#clear-cart');

    

//CREAMOS LOS LISTENERS

loadEventListeners();

function loadEventListeners () {
    courses.addEventListener('click', buyCourse);

    //remover curso
    shoppingCartContent.addEventListener('click', removeCourse);

    //limpiar carrito

    clearCartBtn.addEventListener('click', clearCart);
    
    document.addEventListener('DOMContentLoaded', getFromLocalStorage);

    
    
}


//CREAMOS LAS FUNCIONES A UTILIZAR
function buyCourse(e) {
    e.preventDefault();
    
    if (e.target.classList.contains('add-to-cart')) {
        
        const course = e.target.parentElement.parentElement;
        getCourseInfo(course);
    }
}

function getCourseInfo(course) {
    //Objetos con info de los datos seleccionados
    const courseInfo = {
        image: course.querySelector('img').src,
        title: course.querySelector('h4').textContent,
        price: course.querySelector('.price span').textContent,
        id: course.querySelector('a').getAttribute('data-id')
    }
    
    //agregar en el carrito
    addIntoCart(courseInfo);
}

function addIntoCart(course) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <tr>
            <td>
                <img src="${course.image}" width=100>
            </td>
            <td>${course.title}</td>
            <td>${course.price}</td>
            <td>
                <a href="#" class="remove" data-id="${course.id}">X</a>
            </td>
        </tr> `;
        shoppingCartContent.appendChild(row);
        //agregar en local storage
        saveIntoStorage(course);
        saveIntoStoragePrice(course);
        getTotalPrice(course);
}

//agregando los cursos en localStorage
function saveIntoStorage(course) {
    let courses = getCoursesFromStorage();
    
    // add the course into the array
    courses.push(course);
    
    // since storage only saves strings, we need to convert JSON into String
    localStorage.setItem('courses', JSON.stringify(courses) );
    
}
function saveIntoStoragePrice(course) {
    
    let coursePrice = getCoursesFromStorage();
    // add the course into the array
    
    coursePrice.push(course.price);
    // since storage only saves strings, we need to convert JSON into String
    
    localStorage.setItem('coursePrice', JSON.stringify(coursePrice) );
    console.log(coursePrice)
}

function getCoursesFromStorage(){

    let courses;

    // si existe algo previo, obtenemos el valor o limpiamos el array
    if (localStorage.getItem('courses') === null) {
        courses = [];
    } else {
        courses = JSON.parse(localStorage.getItem('courses'));
    }
    return courses;
    
}

function getTotalPrice(course) {
    let totalPrice;
    totalPrice = JSON.parse(localStorage.getItem('courses'));
  
}

// remove course from the dom
function removeCourse(e) {
    let course, courseId;

    // Remove from the dom
    if(e.target.classList.contains('remove')) {
         e.target.parentElement.parentElement.remove();
         course = e.target.parentElement.parentElement;
         courseId = course.querySelector('a').getAttribute('data-id');
    }
    console.log(courseId);
    // remove from the local storage
    removeCourseLocalStorage(courseId);
}
// remove from local storage
function removeCourseLocalStorage(id) {
    // get the local storage data
    let coursesLS = getCoursesFromStorage();

    // loop trought the array and find the index to remove
    coursesLS.forEach(function(courseLS, index) {
         if(courseLS.id === id) {
              coursesLS.splice(index, 1);
         }
    });

    // Add the rest of the array
    localStorage.setItem('courses', JSON.stringify(coursesLS));
}


function clearCart (e) {
      
    while (shoppingCartContent.firstChild) {
        shoppingCartContent.removeChild (shoppingCartContent.firstChild);
        
    }
}

//carga cuando el dom esta listo

function getFromLocalStorage() {
    let coursesLS = getCoursesFromStorage();

    coursesLS.forEach(function(course) {
        //crear la tabla
        const row = document.createElement('tr')

        row.innerHTML =`
            <tr>
                <td>
                    <img src="${course.image}" width=100>
                </td>
                <td>${course.title}</td>
                <td>${course.price}</td>
                <td>
                    <a href="#" class="remove" data-id="${course.id}">X</a>
                </td>
            </tr> `;

        shoppingCartContent.appendChild(row);
    });
}
