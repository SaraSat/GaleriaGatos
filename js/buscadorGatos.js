
//Gestión  de la petición

function request(url) {
    return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.timeout = 2000;
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response)
                } else {
                    reject(xhr.status)
                }
            }
        }
        xhr.ontimeout = function() {
            reject('timeout')
        }
        xhr.open('get', url, true);
        xhr.responseType = 'json';

        xhr.send();
    })
}


//------ Variables -----

 //Número de la página de la galería
var page = 1;

//Creación de un array para almacenar las razas
var razas=new Array();
var idRazas=new Array();


//Dirección para filtrado solo con categoria
var requestCategory='https://api.thecatapi.com/v1/images/search?limit=8&page=' + page + '&order=Asc&category_ids=' +
document.getElementById('cats').value;



//------Peticiones------

//Petición a github para sacar las categorias -->

request('https://my-json-server.typicode.com/SaraSat/json/categorias').then(imprimirOpcioness);


//Petición a la api de thecatapi.com

request('https://api.thecatapi.com/v1/images/search?category_ids=5&limit=8&page=1&order=Asc').then(fotoCategory);

//Petición para sacar el nombre de la raza 
request("https://api.thecatapi.com/v1/breeds").then(crearArrayRazas);



//------Funciones-------

//Función para imprimir las categorias en options con value =id de la categoria

function imprimirOpcioness(list) {
    list.forEach(cat => document.getElementById('cats').innerHTML += "<option value=" + cat.id + ">" + cat.name + "</option>");

}


//Función para sacar las imágenes de los gatos 

function fotoCategory(listFotos) {
    var fotos = "";
    for (var i = 0; i < listFotos.length; i++) {
        fotos += "<div class='ml-4 mt-5'><img src=" + listFotos[i].url + " width=300 height=200></div<img></div>";
    }
    document.getElementById('fotos').innerHTML = fotos;
    numPagina();
}

//Función para crear un array con el nombre de las razas y otro para las id

function crearArrayRazas(listBreed){
    for(var x=0; x<listBreed.length;x++ ){
        razas[x]=listBreed[x].name;
        idRazas[x]=listBreed[x].id;
    }

}

//Función para autocompletar las razas -->

function filtrarRaza(){
    
    var inputRaza=document.getElementById('raza').value;

    var sugerencia="";


//Comparación del nombre de la raza almacenado en el objeto con la cadena introducida en el input
    for(var j=0; j<razas.length;j++) {
        if(inputRaza!="")
            if (razas[j].substring(0, inputRaza.length).toLocaleUpperCase()== inputRaza.toLocaleUpperCase()){
                if(sugerencia===""){
                    sugerencia= "<br><input type=radio  name=breed value="+idRazas[j]+"> "+razas[j]+"</input>";
                    
                }else{
                    id=idRazas[j]
                    sugerencia = sugerencia + "<br><input type=radio name=breed value="+idRazas[j]+"> "+razas[j];
                }
            }

        }
    if(sugerencia=="") {
        document.getElementById('sugerencia').innerHTML="no hay sugerencias";

    }
    else{
        document.getElementById('sugerencia').innerHTML=sugerencia;

    } 

}



//Función para generar de nuevo la petición de fotos --> Si no se ha filtrado por raza, la petición solo incluye categorias

function generarImagenes(page) {
    if(document.getElementsByName('breed')===null || document.getElementsByName('breed').length===0) {
        requestCategory='https://api.thecatapi.com/v1/images/search?category_ids=' +
           document.getElementById('cats').value+'&limit=8&page=' + page + '&order=Asc';
   }
   else{
       requestCategory='https://api.thecatapi.com/v1/images/search?breed_ids='+document.form.breed.value+'&category_ids=' +
       document.getElementById('cats').value+'&limit=8&page=' + page + 
       '&order=Asc';

   } 
   request(requestCategory).then(fotoCategory);

}

//Paginación

function numPagina(){
    document.getElementById('pagina').innerHTML=page;

}



//-----Eventos:-----

//Evento botón buscar

document.getElementById('buscar').addEventListener('click', function(event) {
   event.preventDefault();
    page=1;
    generarImagenes();
});


//Evento botón siguiente página

document.getElementById('siguiente').addEventListener('click', function() {
    page++;
    generarImagenes();
    numPagina();
});



//Evento botón página anterior

document.getElementById('atras').addEventListener('click', function() {
    if (page > 1) {
        page--;
        generarImagenes();
        numPagina();
    }


});

//Evento al filtrar por raza 

document.getElementById('raza').addEventListener("keyup",filtrarRaza);







