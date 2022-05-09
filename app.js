function btnGetMethod() {
    const ville = document.getElementById("input-city").value;     //Récupération de la ville depuis la saisie utilisateur
    var lat; //latitude localisation
    var lon; //longitude localisation
    const API_KEY = "7218b7f9356a4f16b14e165aa183d933"; //Api key opencage
    let URL = 'https://api.opencagedata.com/geocode/v1/json?q=' + ville + '&key=' + API_KEY + '&language=fr&pretty=1'

    fetch(URL) // on utilise la methode fetch, qui est asynchrone et qui existe par défaut dans le navigateur (on aurait aussi pu utiliser la librairie axios par exemple)
    // on utilise la méthode then() (NB: on pourrait aussi utiliser la syntaxe async/await)
    .then(response => { 
    if (response.status == 200) { // on vérifier que l'appel à l'API a fonctionné
        return response.json()  // ne pas oublier le return du callback
    }
    else console.log(`Erreur lorsqu'on a tenté de récupérer les data`);
    })
    .then(data => {
        lat = data.results[0].geometry.lat;
        lon = data.results[0].geometry.lng;
        getDay(data);
        callbackGetOpenCage(lat, lon);
    })
    .catch(err => console.log(err))
};

const callbackGetOpenCage = function (lat, lon) {
    const API_KEY = "185f5c86e1d85eed7428b5ba6701f372";
    const url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=" + API_KEY;
    //const url = "https://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat +"&lon=" + lon + "&cnt=" + 5 + "&appid=" + API_KEY;
    
    //fonction get et callback
    $.get(url, callbackGetSuccess).done()
    .fail(function () {
        alert("error")
    })
}

function getDay(data) {

    const weather_day = document.getElementById("day");
    weather_day.innerHTML = data.timestamp.created_http;
    console.log(weather_day.innerHTML);

    switch (true) {
        case weather_day.innerHTML.includes("Mon"):
            weather_day.innerHTML = "Monday"
            break;
        case weather_day.innerHTML.includes("Tue"):
            weather_day.innerHTML = "Tuesday"
            break;
        case weather_day.innerHTML.includes("Wed"):
            weather_day.innerHTML = "Wednesday"
            break;
        case weather_day.innerHTML.includes("Thu"):
            weather_day.innerHTML = "Thursday"
            break;
        case weather_day.innerHTML.includes("Sat"):
            weather_day.innerHTML = "Saturday"
            break;
        case weather_day.innerHTML.includes("Sun"):
            weather_day.innerHTML = "Sunday"
            break;
    }
}

const callbackGetSuccess = function (data) {
    const img = document.getElementById("img-weather");
    img.style.display = "block";

    switch (true) {
        case data.current.clouds == 0:
            img.src = "./weathers/sun.svg";
            break;
        case data.current.clouds > 0 && data.clouds.all <= 50:
            img.src = "./weathers/cloudy.svg";
            break;
        case data.current.clouds > 50:
            img.src = "./weathers/clouds.svg";
            break;
        case data.current.snow > 0:
            img.src = "./weathers/snow.svg";
            break;
        default:
            img.src = "./weathers/rain.svg";
            break;
    }
    console.log(data);
}
