var userFormEl = document.querySelector("#user-form"); // get <form> id
var cityInputEl = document.querySelector("#city"); // get text <input> id

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get val from input element
    var currentCity = cityInputEl.value.trim();

    if (currentCity) {
        console.log(currentCity);

        // reset form
        cityInputEl.value = "";
    }
    else {
        console.log("no city found");
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);