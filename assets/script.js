var userFormEl = document.querySelector("#user-form"); // get <form> id
var cityInputEl = document.querySelector("#city"); // get text <input> id

// TODO: TESTING STATIC ID
var cityDisplayEl = document.querySelector("#city-display"); // get <span> id


var getCityData = function(city) {
    // format OpenWeather Geocoding api url
    // key here, since we won't have a backend to store it for this project
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=1&appid=" + "9686278b56b94a147e1e2facc0a2671a";

    fetch(apiUrl)
        .then(function(res) {
            if (res.ok) {
                res.json().then(function(data) {
                    getCityWeather(data, city);
                });
            }
            else {
                console.log("error: city not found"); // TODO: make more user friendly
            }
        })
        
        .catch(function(err) {
            console.log("unable to connect to OpenWeather Geocoding API"); // TODO: make more user friendly
        });

};

var getCityWeather = function(data, city) {

    var lat = data[0].lat.toFixed(2);
    var lon = data[0].lon.toFixed(2);

    // format OpenWeather One Call api url
    // key here, since we won't have a backend to store it for this project
    var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,daily,alerts&units=imperial&appid=" + "9686278b56b94a147e1e2facc0a2671a";

    fetch(url)
        .then(function(res) {
            if (res.ok) {
                res.json().then(function(data) {
                    console.log(data);
                    displayWeatherData(data, city);
                });
            }
            else {
                console.log("error: weather DATA not found"); // TODO: make more user friendly
            }
        })
        
        .catch(function(err) {
            console.log("unable to connect to OpenWeather One Call API"); // TODO: make more user friendly
        });

};

var displayWeatherData = function(data, city) {
    if (data.length === 0) {
        console.log("no city was found..."); // TODO: make more user friendly
        return;
    }

    cityDisplayEl.textContent = city;
    // .textcontent = current.temp .wind_speed .humidity .uvi
    // icon = current.weather.icon ??? ex: "01d"

};

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get val from input element
    var currentCity = cityInputEl.value.trim();

    if (currentCity) {
        getCityData(currentCity);

        // reset form
        cityInputEl.value = "";
    }
    else {
        console.log("please enter a city name"); // TODO: make more user friendly
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);