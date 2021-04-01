const courses = document.querySelector('#courses-list'),
    courses2 = document.querySelector('#courses-list2'),
    total = document.querySelector('#total'),
    shoppingCartContent = document.querySelector('#cart-content tbody'),
    clearCartBtn = document.querySelector('#clear-cart'),
    rowJs = document.querySelector('#courses-list'),
    searchBar = document.querySelector('#searchBar'),
    resultado = document.querySelector('#filtrado'),
    boton = document.querySelector('#boton'),
    clcard = document.querySelector('.card'),
    charactersList = document.querySelector('#charactersList');

    //CREAMOS LOS LISTENERS
loadEventListeners();




/*const filtrar = ()=> {
    console.log(formulario.value);
    const texto = formulario.value.toLowerCase();
    console.log(texto);
    console.log(typeof texto);
    
    if (texto == undefined) {
        generateContent();



    } else {
            
    for(let curso of courseData) {
        let nombre = curso.name.toLocaleLowerCase();
        if(nombre.indexOf(texto) !== -1) {
            resultado.innerHTML +=
            `<div class="card">
                <img src="${curso.img}" class="card-img-top">
                <div class="card-body">
                    <h4>${curso.name}</h4>
                    <p class="cardDesc">${curso.desc}</p>
                    <p class="price">5000<span class="u-pull-right ">${curso.price}</span></p>
                    <a href="#" class="btn btn-primary input add-to-cart" data-id=${curso.id}>Add to Cart</a>
                </div>
            </div>`
            
        }
    }
    }
}
*/

/* boton.addEventListener('click', filtrar); */


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


//cargar pagina con 
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


const displayCharacters = (filteredCharacters) => {
    const htmlString = filteredCharacters
        .map((filteredCharacters) => {
            return `
            <div class="card">
                <img src="${filteredCharacters.img}" class="card-img-top">
                <div class="card-body">
                    <h4>${filteredCharacters.name}</h4>
                    <p class="cardDesc">${filteredCharacters.desc}</p>
                    <p class="price">5000<span class="u-pull-right ">${filteredCharacters.price}</span></p>
                    <a href="#" class="btn btn-primary input add-to-cart" data-id=${filteredCharacters.id}>Add to Cart</a>
                </div>
            </div>`;
        })
        .join('');
    courses.innerHTML = htmlString;
};

displayCharacters(courseData);






/*function generateContent () {
    for (const generate of courseData) {
    let row = document.createElement('div');
    row.className = "col"
    row.innerHTML = `
            <div class="card">
                <img src="${generate.img}" class="card-img-top">
                <div class="card-body">
                    <h4>${generate.name}</h4>
                    <p class="cardDesc">${generate.desc}</p>
                    <p class="price">5000<span class="u-pull-right ">${generate.price}</span></p>
                    <a href="#" class="btn btn-primary input add-to-cart" data-id=${generate.id}>Add to Cart</a>
                </div>
            </div>`;
        rowJs.appendChild(row);
    }
}
generateContent();
*/
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


