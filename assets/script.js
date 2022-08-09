var userFormEl = document.querySelector("#user-form"); // get <form> id
var cityInputEl = document.querySelector("#city"); // get text <input> id

var dynamicContainerEl = document.querySelector("#dynamic-data"); // get <section> id

// var date = new Date();
// var day = date.getDate();
// var month = date.getMonth() + 1;
// var year = date.getFullYear();
// var currentDate = month + "/" + day + "/" + year


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

    // DYNAMICALLY CREATE CURRENT WEATHER INFO + DISPLAY //
    var currentCityDivEl = document.createElement("div");
    currentCityDivEl.classList = "notification p-5";

    var currentCityH2El = document.createElement("h2");
    currentCityH2El.classList = "title is-3";

    var cityDisplayEl = document.createElement("span");
    cityDisplayEl.textContent = city;

    var dateDisplayEl = document.createElement("span");
    dateDisplayEl.textContent = " DATE ";

    var iconDisplayEl = document.createElement("span");
    iconDisplayEl.classList = "icon";

    var iconEl = document.createElement("ion-icon");
    iconEl.setAttribute("name", "cloud-outline");

    var tempDisplayEl = document.createElement("div");
    tempDisplayEl.innerHTML = "Current temperature: " + data.current.temp + " &#176;F";

    var windDisplayEl = document.createElement("div");
    windDisplayEl.innerHTML = "Wind: " + data.current.wind_speed;

    var humidityDisplayEl = document.createElement("div");
    humidityDisplayEl.innerHTML = "Humidity: " + data.current.humidity;

    var uviDisplayEl = document.createElement("div");
    uviDisplayEl.innerHTML = "UV Index: " + data.current.uvi;

    // append all created elements dynamically
    dynamicContainerEl.appendChild(currentCityDivEl);

    currentCityDivEl.appendChild(currentCityH2El);

    currentCityH2El.appendChild(cityDisplayEl);
    currentCityH2El.appendChild(dateDisplayEl);
    currentCityH2El.appendChild(iconDisplayEl);
    iconDisplayEl.appendChild(iconEl);

    currentCityDivEl.appendChild(tempDisplayEl);
    currentCityDivEl.appendChild(windDisplayEl);
    currentCityDivEl.appendChild(humidityDisplayEl);
    currentCityDivEl.appendChild(uviDisplayEl);

    // TODO: FIX ICON
    // TODO: FIX UV INDEX COLOR CODING
    // TODO: FIX CURRENT DATE
    // TODO: MAKE A RESET FUNCTION TO CLEAR DISPLAY BEFORE DISPLAYING MORE



    // DYNAMICALLY CREATE FORCAST INFO + DISPLAY NEXT 5 DAYS //
    var forecastTextEl = document.createElement("h3");
    forecastTextEl.classList = "block title is-4";
    forecastTextEl.innerText = "5-Day Forecast:";
    dynamicContainerEl.appendChild(forecastTextEl);

    var forecastEl = document.createElement("div");
    forecastEl.classList = "block columns";
    dynamicContainerEl.appendChild(forecastEl);

    // REPEAT 5 TIMES FOR NEXT 5 DAYS
    for (var i=0; i<5; i++) {

        var colDayEl = document.createElement("div");
        colDayEl.classList = "column";

        var cardEl = document.createElement("div");
        cardEl.classList = "card";

        var cardHeaderEl = document.createElement("div");
        cardHeaderEl.classList = "card-header has-background-dark";

        var cardHeaderTextEl = document.createElement("p");
        cardHeaderTextEl.classList = "card-header-title has-text-white";
        cardHeaderTextEl.innerText = "DATE";

        var cardContentEl = document.createElement("div");
        cardContentEl.classList = "card-content";

        var contentEl = document.createElement("div");
        contentEl.classList = "content";

        var cardIconDivEl = document.createElement("div");
        cardIconDivEl.classList = "icon";

        var cardIconEl = document.createElement("ion-icon");
        cardIconEl.setAttribute("name", "cloud-outline");

        var cardTempEl = document.createElement("div");
        cardTempEl.innerHTML = "text";

        var cardWindEl = document.createElement("div");
        cardWindEl.innerHTML = "text";

        var cardHumEl = document.createElement("div");
        cardHumEl.innerHTML = "text";

        var cardUVEl = document.createElement("div");
        cardUVEl.innerHTML = "text";

        // append all created elements dynamically
        forecastEl.appendChild(colDayEl);
        colDayEl.appendChild(cardEl);
        cardEl.appendChild(cardHeaderEl);
        cardHeaderEl.appendChild(cardHeaderTextEl);
        cardEl.appendChild(cardContentEl);
        cardContentEl.appendChild(contentEl);
        contentEl.appendChild(cardIconDivEl);
        cardIconDivEl.appendChild(cardIconEl);
        contentEl.appendChild(cardTempEl);
        contentEl.appendChild(cardWindEl);
        contentEl.appendChild(cardHumEl);
        contentEl.appendChild(cardUVEl);

    };
    

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