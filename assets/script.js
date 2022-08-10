var userFormEl = document.querySelector("#user-form"); // get <form> id
var cityInputEl = document.querySelector("#city"); // get text <input> id
var historyContainerEl = document.querySelector("#search-history"); // get <section> id
var dynamicContainerEl = document.querySelector("#dynamic-data"); // get <section> id

var resetBtn = document.querySelector("#reset-btn");


/* GET FUNCTIONS */
var getCityData = function(city) {
    // format OpenWeather Geocoding api url
    // key here, since we won't have a backend to store it for this project
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + "9686278b56b94a147e1e2facc0a2671a";

    fetch(apiUrl)
        .then(function(res) {
            if (res.ok) {
                res.json().then(function(data) {
                    getCityWeather(data, city);
                });
            }
            else {
                alert("Sorry, Geocoding API data not found!");
            }
        })
        
        .catch(function(err) {
            console.log("unable to connect to OpenWeather Geocoding API"); // TODO: make more user friendly
        });

};

var getCityWeather = function(data, city) {

    if (!data[0] && !data[0]) {
        alert("Sorry, weather data for this search cannot be found!");
    }

    else {

        console.log(data);

        var lat = data[0].lat;
        var lon = data[0].lon;

        // format OpenWeather One Call api url
        // key here, since we won't have a backend to store it for this project
        var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + "9686278b56b94a147e1e2facc0a2671a";

        fetch(url)
            .then(function(res) {
                if (res.ok) {
                    res.json().then(function(data) {
                        //displaySearchHistory(city);
                        addToHistory(city);
                        displayCurrentData(data, city);
                        displayForecastData(data);
                    });
                }
                else {
                    alert("Sorry, weather data for this search cannot be found!");
                }
            })
            
            .catch(function(err) {
                console.log("Unable to connect to OpenWeather One Call API");
            });
    }

};

var addToHistory = function(city) {

    // store searched city in `localStorage` if city exists
    if (city) {

        if (localStorage.getItem("cities")) {
            var searchHistoryList = localStorage.getItem("cities");
        }
        else {
            var searchHistoryList = [];
        }

        var newSearch = city;

        localStorage.setItem("cities", [...[searchHistoryList], newSearch]);
    }

    displaySearchHistory();
    
};

/* DISPLAY FUNCTIONS */
var displaySearchHistoryInit = function() {

    // DYNAMICALLY CREATE SEARCH HISTORY + DISPLAY ON FIRST LOAD //

    if (localStorage.getItem("cities")) {
        var searchHistoryList = localStorage.getItem("cities").split(',');

        for (var i=1; i < searchHistoryList.length; i++) {
            var citySearchEl = document.createElement("div");
            citySearchEl.classList = "notification";
            citySearchEl.textContent = searchHistoryList[i];

            historyContainerEl.appendChild(citySearchEl);
        };
    }
};

var displaySearchHistory = function() {

    if (localStorage.getItem("cities")) {
        var searchHistoryList = localStorage.getItem("cities").split(',');

        for (var i=1; i < searchHistoryList.length; i++) {
            var citySearchEl = document.createElement("div");
            citySearchEl.classList = "notification";
            citySearchEl.textContent = searchHistoryList[i];
        };

        historyContainerEl.appendChild(citySearchEl);

    }
};

var displayCurrentData = function(data, city) {

    console.log(data)

    if (data.length === 0) {
        alert("Sorry, no city was found...");
        return;
    }

    // DYNAMICALLY CREATE CURRENT WEATHER INFO + DISPLAY //
    var currentCityDivEl = document.createElement("div");
    currentCityDivEl.classList = "box p-5";

    var currentCityH2El = document.createElement("h2");
    currentCityH2El.classList = "title is-3";

    var cityDisplayEl = document.createElement("span");
    cityDisplayEl.textContent = city;

    var dateDisplayEl = document.createElement("span");
    var date = new Date(data.current.dt * 1000);
    var dateDisplay = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    dateDisplayEl.textContent = " " + dateDisplay + " ";

    var iconDisplayEl = document.createElement("img");
    iconDisplayEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png");

    var iconEl = document.createElement("ion-icon");
    iconEl.setAttribute("name", "cloud-outline");

    var tempDisplayEl = document.createElement("div");
    tempDisplayEl.innerHTML = "Current temperature: " + data.current.temp + " &#176;F";

    var windDisplayEl = document.createElement("div");
    windDisplayEl.innerHTML = "Wind: " + data.current.wind_speed + " mph";

    var humidityDisplayEl = document.createElement("div");
    humidityDisplayEl.innerHTML = "Humidity: " + data.current.humidity + " %";

    var uviDisplayLabelEl = document.createElement("div");
    uviDisplayLabelEl.innerHTML = "UV Index: ";
    var uviDisplayEl = document.createElement("span");
    uviDisplayEl.innerHTML = data.current.uvi;
    uviDisplayEl.classList = "px-2 has-text-white";
    var helpUVEl = document.createElement("p");
    helpUVEl.classList = "help";

    if (data.current.uvi < 3) {
        uviDisplayEl.classList.add("has-background-success");
        helpUVEl.classList.add("has-text-success");
        helpUVEl.innerHTML = "Low - but still a good idea to wear sunscreen if the sun is still up.";
    }
    else if (data.current.uvi < 6) {
        uviDisplayEl.classList.add("has-background-warning");
        helpUVEl.classList.add("has-text-warning-dark");
        helpUVEl.innerHTML = "Moderate - wear your sunscreen!";
    }
    else if (data.current.uvi < 8) {
        uviDisplayEl.classList.add("orange");
        helpUVEl.classList.add("text-orange");
        helpUVEl.innerHTML = "High - sun protection needed!";
    }
    else if (data.current.uvi < 11) {
        uviDisplayEl.classList.add("has-background-danger");
        helpUVEl.classList.add("has-text-danger");
        helpUVEl.innerHTML = "Very high - sun protection required, and try to stay indoors or in the shade!";
    }
    else {
        uviDisplayEl.classList.add("purple");
        helpUVEl.classList.add("text-purple");
        helpUVEl.innerHTML = "Extreme - might be best to stay indoors today. Avoid sun exposure if possible.";
    }

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
    currentCityDivEl.appendChild(uviDisplayLabelEl);

    uviDisplayLabelEl.appendChild(uviDisplayEl);
    uviDisplayLabelEl.appendChild(helpUVEl);

};

var displayForecastData = function(data) { // TODO: FIX ME!!!!!!!!

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
        var date = new Date(data.daily[i + 1].dt * 1000);
        var dateDisplay = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
        cardHeaderTextEl.innerText = dateDisplay;

        var cardContentEl = document.createElement("div");
        cardContentEl.classList = "card-content";

        var contentEl = document.createElement("div");
        contentEl.classList = "content";

        var cardIconDivEl = document.createElement("img");
        cardIconDivEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i + 1].weather[0].icon + ".png");

        var cardIconEl = document.createElement("ion-icon");
        cardIconEl.setAttribute("name", "cloud-outline");

        var cardHighEl = document.createElement("div");
        cardHighEl.innerHTML = "High: " + data.daily[i + 1].temp.max + " &#176;F";

        var cardLowEl = document.createElement("div");
        cardLowEl.innerHTML = "Low: " + data.daily[i + 1].temp.min + " &#176;F";

        var cardWindEl = document.createElement("div");
        cardWindEl.innerHTML = "Wind: " + data.daily[i + 1].wind_speed + " mph";

        var cardHumEl = document.createElement("div");
        cardHumEl.innerHTML = "Humidity: " + data.daily[i + 1].humidity + " %";

        // append all created elements dynamically
        forecastEl.appendChild(colDayEl);
        colDayEl.appendChild(cardEl);
        cardEl.appendChild(cardHeaderEl);
        cardHeaderEl.appendChild(cardHeaderTextEl);
        cardEl.appendChild(cardContentEl);
        cardContentEl.appendChild(contentEl);
        contentEl.appendChild(cardIconDivEl);
        cardIconDivEl.appendChild(cardIconEl);
        contentEl.appendChild(cardHighEl);
        contentEl.appendChild(cardLowEl);
        contentEl.appendChild(cardWindEl);
        contentEl.appendChild(cardHumEl);

    };
};

/* FORM SUBMIT FUNCTION */
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
        alert("Please enter a city name!");
    }
};

var clearHistory = function() {
    localStorage.clear();
    location.reload();
};

/* INITIAL FUNCTIONS */
displaySearchHistoryInit();

/* BUTTON EVENT LISTENERS */
userFormEl.addEventListener("submit", formSubmitHandler);
resetBtn.addEventListener("click", clearHistory);