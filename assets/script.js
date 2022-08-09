var userFormEl = document.querySelector("#user-form"); // get <form> id
var cityInputEl = document.querySelector("#city"); // get text <input> id


var getCityWeather = function(city) {
    // format OpenWeather One Call api url
    // key here, since we won't have a backend to store it for this project
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=1&appid=" + "9686278b56b94a147e1e2facc0a2671a";

    fetch(apiUrl)
        .then(function(res) {
            if (res.ok) {
                displayWeatherData();
            }
            else {
                console.log("error: city not found");
            }
        })
        
        .catch(function(err) {
            console.log("unable to connect to OpenWeather One Call API");
        });

};

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get val from input element
    var currentCity = cityInputEl.value.trim();

    if (currentCity) {
        getCityWeather(currentCity);

        // reset form
        cityInputEl.value = "";
    }
    else {
        console.log("please enter a city name");
    }
};

var displayWeatherData = function() {
    console.log("display weather data function called...")
}

userFormEl.addEventListener("submit", formSubmitHandler);