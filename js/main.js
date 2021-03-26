//CREAMOS LAS VARIABLES

const courses = document.querySelector('#courses-list'),
    total = document.querySelector('#total'),
    shoppingCartContent = document.querySelector('#cart-content tbody'),
    clearCartBtn = document.querySelector('#clear-cart'); 

    //CREAMOS LOS LISTENERS
loadEventListeners();

function loadEventListeners () {
    //comprar curso
    courses.addEventListener('click', buyCourse);
    //remover curso
    shoppingCartContent.addEventListener('click', removeCourse);
    //limpiar carrito
    clearCartBtn.addEventListener('click', clearCart);
    //domcargado
    document.addEventListener('DOMContentLoaded', getFromLocalStorage);   
    
}

//CREAMOS LAS FUNCIONES A UTILIZAR

//funcion comprar curso
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
        price: parseInt( course.querySelector('.price span').textContent),
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
        //llamar a funcion de sumar total del carrito
        sumTotal(course);
        
}

function sumTotal (course) {
        let sumar = getCoursesFromStorage();
        //luego de obtener los datos del localstorage filtramos los datos dejando solo Precios
        let sumarMap = sumar.map((sumar) => sumar.price);
        //iteramos para sumar los valores del total
        let sumado=0;
        for(let i of sumarMap) sumado+=i;
        console.log(sumado);  
        
        //creando la etiqueta en el carrito del Total, limpiando previamente si existe algun dato, para evitar sumas duplicadas
        var div = document.getElementById('total');
         while(div.firstChild){ 
             div.removeChild(div.firstChild); 
        }
        //creando la etiqueta de suma
        const row = document.createElement('div');
         row.innerHTML = `
                <h4>Total: ${sumado}</h4> `;
                total.appendChild(row);
        
        }

//agregando los cursos en localStorage
function saveIntoStorage(course) {
    let courses = getCoursesFromStorage();
    
    courses.push(course);
    
    localStorage.setItem('courses', JSON.stringify(courses) );
    
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
    
// remover curso del DOM
function removeCourse(e) {
    let course, courseId;

    // Remover
    if(e.target.classList.contains('remove')) {
         e.target.parentElement.parentElement.remove();
         course = e.target.parentElement.parentElement;
         courseId = course.querySelector('a').getAttribute('data-id');
    }
    console.log(courseId);
    // remover de local storage
    removeCourseLocalStorage(courseId);
}

// removiendo curso del localstorage
function removeCourseLocalStorage(id) {
    // get the local storage data
    let coursesLS = getCoursesFromStorage();

    // iterando el array para comparar con el id obtenido el selector para eliminar el objeto del array
    coursesLS.forEach(function(courseLS, index) {
         if(courseLS.id === id) {
              coursesLS.splice(index, 1);
         }
    });

    // agregar el resto del array al localstorage
    localStorage.setItem('courses', JSON.stringify(coursesLS));
    // llamar a la funcion suma de total de carrito
    sumTotal();
}

//funcion que vacia el carrito completamente
function clearCart (e) {
      
    while (shoppingCartContent.firstChild) {
        shoppingCartContent.removeChild (shoppingCartContent.firstChild);
        
    }
    while (total.firstChild) {
        total.removeChild (total.firstChild);
        
    }

}
//genera nuevamente el carrito luego de eliminar algun item de la lista
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


