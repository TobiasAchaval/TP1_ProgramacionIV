// js/script.js
window.addEventListener('load', () => {
    // 1. Verificamos si el navegador soporta la Geolocalización
    if (navigator.geolocation) {
        // Si la soporta, pedimos la ubicación.
        // getCurrentPosition() necesita dos funciones: una para el éxito y otra para el error.
        navigator.geolocation.getCurrentPosition(obtenerClimaConUbicacion, manejarErrorDeUbicacion);
    } else {
        // Si no la soporta, mostramos un mensaje de error.
        alert("Tu navegador no soporta la geolocalización. No se puede mostrar el clima.");
    }
    obtenerFinalMundial();
    obtenerPeliculasPopulares
});

/**
 * Función que se ejecuta si el usuario da permiso y obtenemos la ubicación.
 */
function obtenerClimaConUbicacion(posicion) {
    // Extraemos latitud y longitud del objeto 'posicion'
    const lat = posicion.coords.latitude;
    const lon = posicion.coords.longitude;

    console.log(`Ubicación obtenida: Lat=${lat}, Lon=${lon}`);

    const apiKey = 'a6081d17423df5ef39f2c3fe230f1ea0'; // a6081d17423df5ef39f2c3fe230f1ea0
    
    // 2. Modificamos las URLs para usar latitud y longitud en lugar de 'q' (ciudad)
    const urlClimaActual = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
    const urlPronostico = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

    // 3. El resto del código (Promise.all y fetch) va DENTRO de esta función
    Promise.all([
        fetch(urlClimaActual),
        fetch(urlPronostico)
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(([datosClimaActual, datosPronostico]) => {
        mostrarClimaActual(datosClimaActual, datosPronostico);
        mostrarPronostico(datosPronostico);
    })
    .catch(error => {
        console.error('Error al obtener los datos del clima:', error);
    });
}

/**
 * Función que se ejecuta si el usuario deniega el permiso o hay un error.
 */
function manejarErrorDeUbicacion(error) {
    const container = document.getElementById('clima-actual-container');
    let mensajeError = '';

    // Damos un mensaje específico según el tipo de error
    switch(error.code) {
        case error.PERMISSION_DENIED:
            mensajeError = "Permiso de ubicación denegado. No se puede mostrar el clima.";
            break;
        case error.POSITION_UNAVAILABLE:
            mensajeError = "La información de ubicación no está disponible.";
            break;
        case error.TIMEOUT:
            mensajeError = "La solicitud para obtener la ubicación tardó demasiado.";
            break;
        default:
            mensajeError = "Ocurrió un error desconocido al obtener la ubicación.";
            break;
    }

    console.error("Error de Geolocalización:", mensajeError);
    container.innerHTML = `<p class="text-danger text-center">${mensajeError}</p>`;
}


// Las funciones para mostrar los datos (mostrarClimaActual y mostrarPronostico)
// se mantienen exactamente iguales a como las tenías antes.
// ... (pega aquí tus funciones mostrarClimaActual y mostrarPronostico) ...

function mostrarClimaActual(datosClimaActual, datosPronostico) {
    const container = document.getElementById('clima-actual-container');
    const temperatura = Math.round(datosClimaActual.main.temp);
    const tempMax = Math.round(datosClimaActual.main.temp_max);
    const tempMin = Math.round(datosClimaActual.main.temp_min);
    const descripcion = datosClimaActual.weather[0].description;
    const icono = datosClimaActual.weather[0].icon;
    const urlIcono = `https://openweathermap.org/img/wn/${icono}@4x.png`;
    const probLluvia = Math.round(datosPronostico.list[0].pop * 100);

    const tarjetaActualHtml = `
        <div class="card shadow-sm">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h2 class="card-title">${datosClimaActual.name}</h2>
                        <p class="display-1 fw-bold">${temperatura}°C</p>
                        <p class="lead text-capitalize">${descripcion}</p>
                    </div>
                    <div class="col-md-4 text-center">
                        <img src="${urlIcono}" alt="Ícono del clima" style="width: 150px;">
                        <p class="mb-0"><strong>Máx:</strong> ${tempMax}° / <strong>Mín:</strong> ${tempMin}°</p>
                        <p><strong>Prob. de lluvia:</strong> ${probLluvia}%</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = tarjetaActualHtml;
}

function mostrarPronostico(datosPronostico) {
    const container = document.getElementById('info-clima');
    container.innerHTML = '';
    datosPronostico.list.slice(0, 4).forEach(pronostico => {
        const temperatura = Math.round(pronostico.main.temp);
        const icono = pronostico.weather[0].icon;
        const urlIcono = `https://openweathermap.org/img/wn/${icono}@2x.png`;
        const hora = new Date(pronostico.dt_txt).toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const tarjetaPronosticoHtml = `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="card h-100 text-center">
                    <div class="card-header">${hora} hs</div>
                    <div class="card-body">
                        <img src="${urlIcono}" alt="Ícono del clima">
                        <h5 class="card-title">${temperatura}°C</h5>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += tarjetaPronosticoHtml;
    });
}
// js/script.js



// --- NUEVO CÓDIGO PARA LA FINAL DEL MUNDIAL 2022 ---

/**
 * Función para obtener los datos de la final del Mundial 2022.
 */
function obtenerFinalMundial() {
    // El ID único para la final del Mundial 2022 en TheSportsDB
    const eventId = '1666948';
    const apiKey = '123'; // Clave pública

    // Usamos el endpoint 'lookupevent.php' que busca por ID
    const urlFinal = `https://www.thesportsdb.com/api/v1/json/123/lookupevent.php?id=1666948`;

    fetch(urlFinal)
        .then(response => response.json())
        .then(data => {
            console.log("Datos de la Final del Mundo:", data);
            if (data.events && data.events.length > 0) {
                // La API devuelve una lista, pero solo con un evento
                mostrarFinalMundial(data.events[0]);
            } else {
                throw new Error("No se encontró el evento de la final del mundial.");
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos de la final:', error);
            const container = document.getElementById('wc-final-container');
            container.innerHTML = `<div class="alert alert-danger text-center">No se pudo cargar la información de la final.</div>`;
        });
}

/**
 * Muestra el resultado de la final en una tarjeta de Bootstrap.
 * @param {object} eventData - Los datos del partido.
 */
function mostrarFinalMundial(eventData) {
    const container = document.getElementById('wc-final-container');
    container.innerHTML = ''; // Limpiamos

    // Extraemos todos los datos del evento
    const homeTeam = eventData.strHomeTeam;
    const awayTeam = eventData.strAwayTeam;
    const homeScore = eventData.intHomeScore;
    const awayScore = eventData.intAwayScore;
    const eventName = eventData.strEvent;
    const date = eventData.dateEvent;
    const finalResult = eventData.strResult; // Este campo es muy largo, lo usaremos si queremos
    const description = eventData.strDescriptionEN; // ¡Una descripción perfecta del partido!
    const venue = eventData.strVenue; // Estadio
    const thumbnail = eventData.strThumb; // Imagen del evento
    const videoLink = eventData.strVideo; // Enlace a los highlights

    const cardHtml = `
        <div class="col-md-10 col-lg-8">
            <div class="card text-center shadow">
                <img src="${thumbnail}" class="card-img-top" alt="Final del Mundo 2022">
                <div class="card-header">
                    <h5 class="card-title mb-0">${eventName}</h5>
                    <small class="text-muted">${date} - ${venue}</small>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-center align-items-center my-3">
                        <span class="fs-4 fw-bold me-3">${homeTeam}</span>
                        <span class="badge bg-primary fs-2">${homeScore} - ${awayScore}</span>
                        <span class="fs-4 fw-bold ms-3">${awayTeam}</span>
                    </div>
                    <p class="card-text"><strong>Resultado Final:</strong> Argentina ganó 4-2 en la tanda de penales.</p>
                    <hr>
                    <p class="card-text text-start">
                        <strong>Resumen del partido:</strong> ${description.substring(0, 400)}...
                    </p>
                </div>
                <div class="card-footer">
                    <a href="${videoLink}" class="btn btn-danger" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-youtube me-2" viewBox="0 0 16 16">
                            <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.188-.01 1.043-.074 1.957l-.008.104-.022.26-.01.104c-.048.519-.119 1.023-.22 1.402a2.01 2.01 0 0 1-1.415 1.42c-1.123.302-5.288.332-6.11.335h-.089c-.822-.003-4.987-.033-6.11-.335a2.01 2.01 0 0 1-1.415-1.42c-.101-.38-.172-.883-.22-1.402l-.01-.104-.022-.26-.008-.104C.065 7.914.057 7.058.056 6.87v-.075c.001-.188.01-1.043.074-1.957l.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c1.123-.302 5.288-.332 6.11-.335zM5.405 6.458a.8.8 0 0 0-.427 1.43l3.234 1.94a.8.8 0 0 0 1.222-.715V7.173a.8.8 0 0 0-1.222-.715L5.83 8.353a.797.797 0 0 0-.425-1.895z"/>
                        </svg>
                        Ver Resumen en YouTube
                    </a>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = cardHtml;
}
function obtenerPeliculasPopulares() {
    // IMPORTANTE: Debes obtener tu propia API Key de TMDb.
    // Esta es una clave de ejemplo y podría no funcionar.
    const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzMyMTQ3YjQxOGY2MDhiMGI5ZDEwZDAzODVjY2ZlMiIsInN1YiI6IjY2MjgwNWE4NjJmMzM1MDE2MzU4OWE1MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.b4ege4sYyvfR59wnr-Xd2n2H1Nfr8FprKor2Lg6e2Cg';

    const url = 'https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1';
    
    // TMDb requiere que la clave se envíe en los "headers" de la petición
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiKey}`
        }
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log("Datos de TMDb:", data);
            if (data.results) {
                mostrarPeliculas(data.results);
            } else {
                throw new Error("No se encontraron películas populares.");
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos de TMDb:', error);
            const container = document.getElementById('tmdb-container');
            container.innerHTML = `<div class="alert alert-warning text-center">No se pudieron cargar las películas.</div>`;
        });
}

/**
 * Muestra las películas en tarjetas de Bootstrap.
 * @param {Array} peliculas - La lista de películas populares.
 */
function mostrarPeliculas(peliculas) {
    const container = document.getElementById('tmdb-container');
    container.innerHTML = ''; // Limpiamos

    peliculas.slice(0, 8).forEach(pelicula => { // Mostramos solo las primeras 8
        const titulo = pelicula.title;
        const sinopsis = pelicula.overview;
        const posterPath = pelicula.poster_path;
        const urlPoster = `https://image.tmdb.org/t/p/w500${posterPath}`;

        const cardHtml = `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${urlPoster}" class="card-img-top" alt="Póster de ${titulo}">
                    <div class="card-body">
                        <h5 class="card-title">${titulo}</h5>
                        <p class="card-text">${sinopsis.substring(0, 100)}...</p>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}