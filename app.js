/*------------      Fonction d'action       -------------------
------------    lors de l'appui du bouton      -------------------*/

function btnGetMethod() {
    callApiOpenCage();
};

/*------------      Fonctions de call      -------------------
------------             des API      -------------------*/

const callApiOpenCage = function () {
    const ville = document.getElementById("input-city").value;     //Récupération de la ville depuis la saisie utilisateur
    var lat; //latitude localisation
    var lon; //longitude localisation
    const API_KEY = "7218b7f9356a4f16b14e165aa183d933"; //Api key opencage
    let URL = 'https://api.opencagedata.com/geocode/v1/json?q=' + ville + '&key=' + API_KEY + '&language=fr&pretty=1'

    fetch(URL) // on utilise la methode fetch, qui est asynchrone et qui existe par défaut dans le navigateur (on aurait aussi pu utiliser la librairie axios par exemple)
    // on utilise la méthode then() (NB: on pourrait aussi utiliser la syntaxe async/await)
    .then(response => { 
    if (response.status == 200) { // on vérifie que l'appel à l'API a fonctionné
        return response.json()  // ne pas oublier le return du callback
    }
    else console.log(`Erreur lorsqu'on a tenté de récupérer les data`);
    })
    .then(data => {
        lat = data.results[0].geometry.lat;
        lon = data.results[0].geometry.lng;
        //Cette fonction fait elle même appel aux autres fonctions d'api call
        callApiOpenWeather(lat, lon);
        callApiSunriseSunset(lat, lon);
    })
    .catch(err => console.log(err))
} 


//Appel de l'api openweather en passant la latitude et longitude en paramètres. paramètres à récupérer au niveau de la data extraite de l'api openCage
const callApiOpenWeather = function (lat, lon) {
    const API_KEY = "185f5c86e1d85eed7428b5ba6701f372";
    const url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY +"&units=metric";
    
    //appel de l'api avec la methode get et appel de la fonction getSuccess en cas de bon call de l'api, sinon error
    $.get(url, displayWeatherResultsFromOpenWeather).done()
    .fail(function () {
        alert("error")
    })
}

//Appel et récupération des données de l'API sunrise + récupération des données de l'api openWeather pour l'heure
const callApiSunriseSunset = function(lat, lon) {

    const API_KEY = "185f5c86e1d85eed7428b5ba6701f372";
    const urlOpenWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY +"&units=metric";
    const URLSunrise = "https://api.sunrise-sunset.org/json?lat=" +  lat + "&lng=" + lon;
    
    fetch(URLSunrise) // on utilise la methode fetch, qui est asynchrone et qui existe par défaut dans le navigateur (on aurait aussi pu utiliser la librairie axios par exemple)
    // on utilise la méthode then() (NB: on pourrait aussi utiliser la syntaxe async/await)
    .then(response => { 
    if (response.status == 200) { // on vérifie que l'appel à l'API a fonctionné
        return response.json()  // ne pas oublier le return du callback
    }
    else console.log(`Erreur du call de l'api sunrise`);
    })
    .then(dataSunrise => {
        $.get(urlOpenWeather, function (dataOpenWeather, status) {
            displayNightAndDayWithTime(dataSunrise, dataOpenWeather);
        })

    })
    .catch(err => console.log(err))

}


/*------------      Fonctions de traitement      -------------------
------------    et d'extraction des données des API      -------------------*/


//This function get the time and compare it with sunrise time and sunset time of the place and display night or day mode in DOM
function displayNightAndDayWithTime(dataSunrise, dataOpenWeather) {
            const unixTimeStamp = dataOpenWeather.current.dt; //get timestamp in data
            const dateObject = new Date(unixTimeStamp*1000) //convert to millisecond
            var timeOfCity = dateObject.toLocaleString("en-US", {hour: "numeric", minute: "numeric", second: "numeric"}) // HH:mm:ss AM

            const sunriseTime = dataSunrise.results.sunrise;
            const sunsetTime = dataSunrise.results.sunset;
        
            if (Date.parse('01/01/2011 ' + timeOfCity) < Date.parse('01/01/2011 ' + sunriseTime ) || Date.parse('01/01/2011 ' + timeOfCity) > Date.parse('01/01/2011' + sunsetTime)) {
                document.body.style.backgroundColor = "darkblue";
                document.getElementById("weather_result").style.filter = "invert(1)"
                document.getElementById("title_h1").style.color = "white"
            } else {
                document.body.style.backgroundColor = "aqua";
                document.getElementById("weather_result").style.filter = "invert(0)"
                document.getElementById("title_h1").style.color = "Black"
            }
}

//En cas de success de la méthode get sur l'api Openweather, on récupère et manipule les données qui nous intéressent
const displayWeatherResultsFromOpenWeather = function (data) {

    reloadDivs();

        for (let i = 0; i < userChoiceDay(); i++) {

            const unixTimeStamp = data.daily[i].dt; //get timestamp in data
            const dateObject = new Date(unixTimeStamp*1000) //convert to millisecond
            const weekDay = dateObject.toLocaleString("en-US", {weekday: "long"}) //Tuesday
            const dayH3 = document.createElement("h3");
            dayH3.innerHTML = weekDay;
    
            const img = document.createElement('img')
            img.style.width = "10%";
        
            switch (true) {
            case data.daily[i].weather[0].description == "clear sky":
                img.src = "./weathers/sun.svg";
                break;
            case data.daily[i].clouds > 0 && data.daily[i].clouds <= 50 && (data.daily[i].weather[0].id <500 || data.daily[i].weather[0].id >531 ):
                img.src = "./weathers/cloudy.svg";
                break;
            case data.daily[i].clouds > 50:
                img.src = "./weathers/clouds.svg";
                break;
            case data.daily[i].snow > 0:
                img.src = "./weathers/snow.svg";
                break;
            case data.daily[i].weather[0].id >=500 && data.daily[i].weather[0].id <=531:
                img.src = "./weathers/rain.svg";
                break;
        }
            document.getElementById("day").appendChild(dayH3);
            document.getElementById("img_result").appendChild(img);
            console.log(data.daily[i])
        }
    }


/*------------      Fonctions de gestion      -------------------
--------------    d'évènements de la page      -------------------*/


//on récupère la valeur saisie lors de la selection d'une option sur le dropdown
document.addEventListener("DOMContentLoaded", function () {
    // here you can safely manipulate the DOM.
    document.getElementById("nbrDays").addEventListener("change", function () {
        userChoiceDay();
    });
  });

//fonction pour récupérer la valeur entière de la selection utilisateur 
function userChoiceDay() {
    const selectDays = document.getElementById("nbrDays");
    var value = selectDays.options[selectDays.selectedIndex].value;
    return parseInt(value);
}

 //To reload content of divs img_result and day 
 //We remove child of divs
function reloadDivs() {
    dayDiv = document.getElementById("day");
    img_resultDiv = document.getElementById("img_result");
    var childImg = img_resultDiv.lastElementChild; 
    var childDay = dayDiv.lastElementChild;
    while (childImg) {
        img_resultDiv.removeChild(childImg);
        dayDiv.removeChild(childDay);
        childImg = img_resultDiv.lastElementChild;
        childDay = dayDiv.lastElementChild;
    }
}
