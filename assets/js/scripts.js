
var submitButton = document.querySelector("#search-btn");
var cityInputEl = document.querySelector("input");
var cityListEl = document.querySelector(".cities");

var cardEl = document.getElementsByClassName("card");

var cityList = [];

var gData = [];
var selectedCity = "";

var submitButtonHandler = function (event) {
    event.preventDefault();

    selectedCity = cityInputEl.value.trim();

    if (selectedCity) {
        var cityData = getLatLong(selectedCity);
        cityInputEl.value = "";
    }
    else {
        alert("please enter a city");
    }

    console.log("Button",gData);

    setTimeout(function () {
        loadPage();
    }, 1000);
};


var getLatLong = function (selectedCity) {
   
    //var apiUrl = "http://api.positionstack.com/v1/forward?access_key=f17a81d114fb01bebd0af5544d9e26f5&query=" + selectedCity + "&limit=1";
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + selectedCity + "&units=imperial&APPID=fef5f3c78f3cb74fc39053b9cda63aea";
    //var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=Denver&units=imperial&APPID=fef5f3c78f3cb74fc39053b9cda63aea";
    
    console.log(apiUrl);
   
    fetch(apiUrl).then(function (response) {
            response.json().then(function (data) {
                saveCity(selectedCity,data.coord.lon,data.coord.lat);
                getWeather(data.coord.lon,data.coord.lat);
            });        
    });

}

var getWeather = function(cityLon,cityLat){
    let weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+cityLat+"&lon="+cityLon+"&exclude=minutely,hourly&units=imperial&appid=fef5f3c78f3cb74fc39053b9cda63aea";
    //let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=tonbridge&units=imperial&APPID=fef5f3c78f3cb74fc39053b9cda63aea";

    fetch(weatherURL).then(function (response) {

        response.json().then(function (data) {  
            displayData(data);      
        });
    });
}

let loadCity = function(){
    cityList = JSON.parse(localStorage.getItem("cities"));

    if (!cityList) {
        cityList = []};

    for (i=0; i < cityList.length; i++){
        var cityEl = document.createElement('h5');
        cityEl.innerHTML=cityList[i].city;
        cityEl.classList.add("col-12");
        cityEl.setAttribute("longitude",cityList[i].lon);
        cityEl.setAttribute("latitide",cityList[i].lat);
        console.log(cityEl.getAttribute('longitude'));
        console.log(cityEl.getAttribute('latitide'));
        cityListEl.append(cityEl);
    }

    if(cityList.length > 0){
    getWeather(cityList[0].lon,cityList[0].lat);
    selectedCity = cityList[0].city
    };

    setTimeout(function () {
        loadPage();
    }, 1000);
   
}

let saveCity = function(cityName, cityLon, cityLat) {

    let tempArray = {};

    console.log(cityList.find(v => v.city === cityName));
    tempArray = (cityList.find(v => v.city === cityName));
    if (!tempArray) {
        tempArray = {city:cityName,lon:cityLon, lat:cityLat};
        cityList.push(tempArray);
        localStorage.setItem("cities", JSON.stringify(cityList));
        var cityEl = document.createElement('h5');
        cityEl.innerHTML=cityName;
        cityEl.setAttribute("longitude",cityLon);
        cityEl.setAttribute("latitide",cityLat);
        cityEl.classList.add("col-12");
        cityListEl.append(cityEl);
    }
}



let displayData = function(temp){
    gData = temp;
    console.log(gData);
}

submitButton.addEventListener("click", submitButtonHandler);

document.getElementById("input")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    console.log(event);
    if (event.key === "Enter") {
        submitButton.click();
    }
});

cityListEl.addEventListener("click", function(item){
    console.log(item.target.innerHTML);
    console.log(item.target.getAttribute('longitude'));
    console.log(item.target.getAttribute('latitide'));
    selectedCity = item.target.innerHTML;
    getWeather(item.target.getAttribute('longitude'),item.target.getAttribute('latitide'));

    setTimeout(function () {
        loadPage();
    }, 1000);
});

let loadPage = function(){

    document.getElementById("cityName").innerHTML = selectedCity;
    document.getElementById("currentDate").innerHTML = new Date(gData.current.dt).toLocaleDateString("en-US");
    document.getElementById("titleImg").src = "https://openweathermap.org/img/wn/"+ gData.current.weather[0].icon +"@2x.png"
    document.getElementById("currentTemp").innerHTML = gData.current.temp + "°F";
    document.getElementById("currentWind").innerHTML = gData.current.wind_speed + " MPH";
    document.getElementById("currentHumidity").innerHTML = gData.current.humidity +"%";
    document.getElementById("currentUV").innerHTML = gData.current.uvi;
   

}

loadCity();



 // console.log(cardEl[0].childNodes[3]);
    // let imageTest = cardEl[0].querySelector("img");
    // console.log(imageTest);
    // imageTest.src="https://openweathermap.org/img/wn/13d@2x.png";