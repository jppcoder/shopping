//creando constantes
const courses = document.querySelector('#courses-list'),
    total = document.querySelector('#total'),
    shoppingCartContent = document.querySelector('#cart-content tbody'),
    clearCartBtn = document.querySelector('#clear-cart'),
    rowJs = document.querySelector('#courses-list'),
    searchBar = document.querySelector('#searchBar'),
    charactersList = document.querySelector('#charactersList'),
    toast = document.querySelector('#liveToast');

    //Creamos los listeners
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
//funcion para ocultar y mostrar el menu lateral con jquery
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

//Funciones

//funcion barra buscadora
searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredCharacters = courseData.filter((character) => {
        return (
            character.name.toLowerCase().includes(searchString)
            
        );
    });
    console.log(filteredCharacters);
    displayCharacters(filteredCharacters);
});

//funcion que filtra los datos ingresados de la barra buscadora
const displayCharacters = (filteredCharacters) => {
    const htmlString = filteredCharacters
        .map((filteredCharacters) => {
            return `
            <div class="col mb-5" data-aos="fade-down" data-aos-delay="100" data-aos-duration="50">
                <div class="card coursesCard">
                    <img src="${filteredCharacters.img}" class="card-img-top">
                    <div class="card-body">
                        <h4>${filteredCharacters.name}</h4>
                        <p class="cardDesc">${filteredCharacters.desc}</p>
                        <p class="price">$<span class="u-pull-right ">${filteredCharacters.price}</span></p>
                        <a href="#"  class="btn input add-to-cart infoContButton" data-id=${filteredCharacters.id}>Agregar al carro</a>
                    </div>
                </div>
            </div>`;
        })
        .join('');
    courses.innerHTML = htmlString;
};
//llamado a la funcion para completar incialmente el html con el array de datos
displayCharacters(courseData);


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
    buyMessage(courseInfo);
}

function addIntoCart(course) {
    const row = document.createElement('tr');
    row.classList = "rowlist p-3 m-3";
    row.innerHTML = `
        <tr>
            <td>
                <img src="${course.image}" width=100>
            </td>
            <td>${course.title}</td>
            <td>$ ${course.price}.00 Ars</td>
            <td>
                <a href="#" class="remove bi bi-dash-circle" data-id="${course.id}"></a>
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
                <h5 class="sumado">Total: $ ${sumado}.00 Ars</h5> `;
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
    // obtenemos la informacion de localstorage
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
    }while (total.firstChild) {
        total.removeChild (total.firstChild);
        
    }   
    localStorage.removeItem('courses');
}
//genera nuevamente el carrito luego de eliminar algun item de la lista
function getFromLocalStorage() {
    let coursesLS = getCoursesFromStorage();

    coursesLS.forEach(function(course) {
        //crear la tabla
        const row = document.createElement('tr')
        row.classList = "col";
        row.innerHTML =`
            <tr>
                <td>
                    <img src="${course.image}" width=100>
                </td>
                <td>${course.title}</td>
                <td>$ ${course.price}.00 Ars</td>
                <td>
                    <a href="#" class="remove bi bi-dash-circle" data-id="${course.id}"></a>
                </td>
            </tr> `;
        shoppingCartContent.appendChild(row);
    });
}

function buyMessage (course) { 
    console.log(course.name)
    console.log(courseData.name)
}

function buyMessage(course) {
    toast.className = "toast show";
    setTimeout(function(){
        toast.className = "toast hide";
    },3000) 
}