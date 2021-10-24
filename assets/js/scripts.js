
var submitButton = document.querySelector("#search-btn");
var cityInputEl = document.querySelector("input");

var cardEl = document.getElementsByClassName("card");

var cityList = [];

var gData = [];

var submitButtonHandler = function (event) {
    event.preventDefault();

    var selectedCity = cityInputEl.value.trim();

    if (selectedCity) {
        var cityData = getLatLong(selectedCity);
        cityInputEl.value = "";
    }
    else {
        alert("please enter a city");
    }

    // console.log(cardEl[0].childNodes[3]);
    // let imageTest = cardEl[0].querySelector("img");
    // console.log(imageTest);
    // imageTest.src="https://openweathermap.org/img/wn/13d@2x.png";
    
    console.log("Button",gData);
};


var getLatLong = function (selectedCity) {
   
    //var apiUrl = "http://api.positionstack.com/v1/forward?access_key=f17a81d114fb01bebd0af5544d9e26f5&query=" + selectedCity + "&limit=1";
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + selectedCity + "&units=imperial&APPID=fef5f3c78f3cb74fc39053b9cda63aea";
    //var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=Denver&units=imperial&APPID=fef5f3c78f3cb74fc39053b9cda63aea";
    
    console.log(apiUrl);
   
    fetch(apiUrl).then(function (response) {
            response.json().then(function (data) {
                saveCity(selectedCity,data.coord.lon,data.coord.lat);
                displayData(data);
            });        
    });

}

let loadCity = function(){
    cityList = JSON.parse(localStorage.getItem("cities"));

    if (!cityList) {
        cityList = []};

        $.each(cityList, function() {
            console.log($(this));
        });

}

let saveCity = function(cityName, cityLon, cityLat) {

    let tempArray = {};

    console.log(cityList.find(v => v.city === cityName));
    tempArray = (cityList.find(v => v.city === cityName));
    if (!tempArray) {
        tempArray = {city:cityName,lon:cityLon, lat:cityLat};
        cityList.push(tempArray);
        localStorage.setItem("cities", JSON.stringify(cityList));
    }
}

let displayData = function(temp){
    gData = temp;
    console.log(gData);
}

submitButton.addEventListener("click", submitButtonHandler)

loadCity();



























//let weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=40.773201&lon=-111.933984&exclude=minutely,hourly&units=imperial&appid=fef5f3c78f3cb74fc39053b9cda63aea";

let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=tonbridge&units=imperial&APPID=fef5f3c78f3cb74fc39053b9cda63aea";

//let weatherURL = "https://api.openweathermap.org/data/2.5/onecall?q=84105&exclude=minutely,hourly&units=imperial&appid=fef5f3c78f3cb74fc39053b9cda63aea";


fetch(weatherURL).then(function (response) {

    response.json().then(function (data) {

        console.log(data);            
    });
});