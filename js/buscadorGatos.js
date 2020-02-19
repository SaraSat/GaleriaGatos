
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


//------Peticiones------

//Petición a github para sacar las categorias -->

request('https://my-json-server.typicode.com/SaraSat/json/categorias').then(imprimirOps);


//Petición a la api de thecatapi.com

request('https://api.thecatapi.com/v1/images/search?page=1&limit=8&order=Asc&category_ids=5').then(fotoCategory);



//------Funciones-------

//Función para imprimir las categorias en options con value =id de la categoria

function imprimirOps(list) {
    list.forEach(cat => document.getElementById('cats').innerHTML += "<option value=" + cat.id + ">" + cat.name + "</option>");

}


//Función para sacar las imágenes de los gatos 

function fotoCategory(listFotos) {
    var fotos = "";
    for (var i = 0; i < listFotos.length; i++) {
        fotos += "<div class='ml-4 mt-5'><img src=" + listFotos[i].url + " width=300 height=200></div<img></div>";
    }
    document.getElementById('fotos').innerHTML = fotos;
}



//Función para generar de nuevo la petición de fotos

function generarImagenes(page) {
    request('https://api.thecatapi.com/v1/images/search?page=' + page + '&limit=8&order=Asc&category_ids=' +
        document.getElementById('cats').value).then(fotoCategory);

}



//-----Eventos:-----

//Evento botón buscar

document.getElementById('buscar').addEventListener('click', function() {
    request('https://api.thecatapi.com/v1/images/search?page=1&limit=8&order=Asc&category_ids=' +
        document.getElementById('cats').value).then(fotoCategory);

});


//Evento botón siguiente página

document.getElementById('siguiente').addEventListener('click', function() {
    page++;
    generarImagenes();
});



//Evento botón página anterior

document.getElementById('atras').addEventListener('click', function() {
    if (page > 1) {
        page--;
        generarImagenes();
    }


})

