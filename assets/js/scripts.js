
var submitButton = document.querySelector("#search-btn");

var cityInputEl = document.querySelector("input")





var submitButtonHandler = function (event) {
    event.preventDefault();

    var selectedCity = cityInputEl.value.trim();

 
    if (selectedCity) {
        getLatLong(selectedCity);
        cityInputEl.value = "";

    }
    else {
        alert("please enter a city");
    }

};



var getLatLong = function (selectedCity) {
   
    var apiUrl = "http://api.positionstack.com/v1/forward?access_key=f17a81d114fb01bebd0af5544d9e26f5&query=" + selectedCity + "&limit=1";
    console.log(apiUrl);

    fetch(apiUrl).then(function (response) {
        
        response.json().then(function (data) {

            var lat = data.data[0].latitude;
            var lon = data.data[0].longitude;
            console.log(lat);
            console.log(lon);
            console.log(data);           
        })
    })


};



submitButton.addEventListener("click", submitButtonHandler)



//let weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=40.773201&lon=-111.933984&exclude=minutely,hourly&units=imperial&appid=fef5f3c78f3cb74fc39053b9cda63aea";

let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=tonbridge&units=imperial&APPID=fef5f3c78f3cb74fc39053b9cda63aea";

//let weatherURL = "https://api.openweathermap.org/data/2.5/onecall?q=84105&exclude=minutely,hourly&units=imperial&appid=fef5f3c78f3cb74fc39053b9cda63aea";


fetch(weatherURL).then(function (response) {

    response.json().then(function (data) {

        console.log(data);            
    });
});