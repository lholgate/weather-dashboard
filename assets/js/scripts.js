
//set object variables
var submitButton = document.querySelector("#search-btn");
var cityInputEl = document.querySelector("input");
var cityListEl = document.querySelector(".cities");

var cardEl = document.getElementsByClassName("card");

//set array vaiables
var cityList = [];
var gData = [];

//set global vaiables
var selectedCity = "";

//Look up city coordinates on button press
var submitButtonHandler = function (event) {
    event.preventDefault();
    selectedCity = cityInputEl.value.trim();

    if (selectedCity) {
        //call function to retrieve city coordiates
        var cityData = getLatLong(selectedCity);
        cityInputEl.value = "";
    }
    else {
        //alert if city selection is blank
        alert("Please enter a city");
    }

    // one second wait for API call to complete
    setTimeout(function () {
        //call function to load all page vales from API response
        loadPage();
    }, 1000);
};

//function to retrieve city coordinates
var getLatLong = function (selectedCity) {
    //set API URL
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + selectedCity + "&units=imperial&APPID=fef5f3c78f3cb74fc39053b9cda63aea";
    //fetch city coordinates
    fetch(apiUrl).then(function (response) {
            response.json().then(function (data) {
                //call function to save city coordinates to local storage
                saveCity(selectedCity,data.coord.lon,data.coord.lat);
                //call function to retrieve weather data from API
                getWeather(data.coord.lon,data.coord.lat);
            });        
    });
}

//function to retrieve weather data
var getWeather = function(cityLon,cityLat){
    //set API URL
    let weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+cityLat+"&lon="+cityLon+"&exclude=minutely,hourly&units=imperial&appid=fef5f3c78f3cb74fc39053b9cda63aea";
  
    //feteh weather data from API
    fetch(weatherURL).then(function (response) {
        response.json().then(function (data) {  
            //save response to global array
            displayData(data);      
        });
    });
}

//function to load city list from local storage
let loadCity = function(){
    //retrieve city list form local storage
    cityList = JSON.parse(localStorage.getItem("cities"));
    //check if array is retreived and set to empty array is no data is retrieved
    if (!cityList) {
        cityList = []};

    //built HTML for city list from local storage
    for (i=0; i < cityList.length; i++){
        var cityEl = document.createElement('h5');
        cityEl.innerHTML=cityList[i].city;
        cityEl.classList.add("col-12");
        cityEl.setAttribute("longitude",cityList[i].lon);
        cityEl.setAttribute("latitide",cityList[i].lat);
        cityListEl.append(cityEl);
    }

    //call get weather function for first city in local starage
    if(cityList.length > 0){
    getWeather(cityList[0].lon,cityList[0].lat);
    selectedCity = cityList[0].city
    };

    //wait one second for API response before loading page data
    setTimeout(function () {
        //call function to load weather data to page
        loadPage();
    }, 1000);
   
}

//function to save city data to local storage
let saveCity = function(cityName, cityLon, cityLat) {
    //define object for city to store
    let tempArray = {};
    //check if object already exists for city name
    tempArray = (cityList.find(v => v.city === cityName));

    //if no object exists for city then create record for local storage
    if (!tempArray) {
        //save city data to local storage
        tempArray = {city:cityName,lon:cityLon, lat:cityLat};
        cityList.push(tempArray);
        localStorage.setItem("cities", JSON.stringify(cityList));
        //add HTML object to city list
        var cityEl = document.createElement('h5');
        cityEl.innerHTML=cityName;
        cityEl.setAttribute("longitude",cityLon);
        cityEl.setAttribute("latitide",cityLat);
        cityEl.classList.add("col-12");
        cityListEl.append(cityEl);
    }
}
//store weather response in global array
let displayData = function(temp){
    gData = temp;
}

//capture click of city search button and call function
submitButton.addEventListener("click", submitButtonHandler);

//check for ENTER key on city search imput and call button click
document.getElementById("input")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key === "Enter") {
        submitButton.click();
    }
});

//listen for clicks on cities in city list
cityListEl.addEventListener("click", function(item){
    selectedCity = item.target.innerHTML;
    //call function too get weather for city clicked
    getWeather(item.target.getAttribute('longitude'),item.target.getAttribute('latitide'));

    //wait one second for response from weather API
    setTimeout(function () {
        //call function to load page data from global array
        loadPage();
    }, 1000);
});
//functiont o load page data from API response
let loadPage = function(){

    document.getElementById("cityName").innerHTML = selectedCity;
    document.getElementById("currentDate").innerHTML ="(" + new Date(gData.current.dt*1000).toLocaleDateString("en-US") + ")";
    document.getElementById("titleImg").src = "https://openweathermap.org/img/wn/"+ gData.current.weather[0].icon +"@2x.png"
    document.getElementById("titleImg").alt = gData.current.weather[0].description;
    document.getElementById("currentTemp").innerHTML = gData.current.temp + "°F";
    document.getElementById("currentWind").innerHTML = gData.current.wind_speed + " MPH";
    document.getElementById("currentHumidity").innerHTML = gData.current.humidity +"%";
    document.getElementById("currentUV").innerHTML = gData.current.uvi;
    if(gData.current.uvi > 2){
        document.getElementById("currentUV").style.backgroundColor="red";
        document.getElementById("currentUV").style.color="white";
    }
    else if (gData.current.uvi > 1) {
        document.getElementById("currentUV").style.backgroundColor="yellow";
        document.getElementById("currentUV").style.color="black";
    }
    else {
        document.getElementById("currentUV").style.backgroundColor="green";
        document.getElementById("currentUV").style.color="white";
    }
    for(let i = 0;i < cardEl.length; i++){

        cardEl[i].querySelector(".card-header").innerHTML="(" + new Date(gData.daily[i+1].dt*1000).toLocaleDateString("en-US") + ")";
        cardEl[i].querySelector("img").src="https://openweathermap.org/img/wn/"+gData.daily[i+1].weather[0].icon +"@2x.png";
        cardEl[i].querySelector("img").alt= gData.daily[i+1].weather[0].description;
        cardEl[i].querySelector("#temp").innerHTML = gData.daily[i+1].temp.day + "°F";
        cardEl[i].querySelector("#wind").innerHTML = gData.daily[i+1].wind_speed + " MPH";
        cardEl[i].querySelector("#humidity").innerHTML = gData.daily[i+1].humidity +"%";
    }
   
}

//call function to retrieve cities form local storage
loadCity();
