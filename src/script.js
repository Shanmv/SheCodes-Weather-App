//Date for h2
function formatDate(currentDate) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = days[currentDate.getDay()];
  let month = months[currentDate.getMonth()];
  let date = currentDate.getDate();
  let year = currentDate.getFullYear();
  let hour = currentDate.getHours();
  let amPm = hour >= 12 ? "PM" : "AM";
  let twelveHr = hour % 12 || 12;
  let minute = currentDate.getMinutes();
  minute = minute <= 9 ? "0" + minute : minute;
  let formattedDate = `${day}, ${month} ${date}, ${year}   <small>Last updated at ${twelveHr}:${minute} ${amPm} </small>`;
  return formattedDate;
}
let today = formatDate(new Date());
let h2 = document.querySelector("h2");
h2.innerHTML = `${today}`;

//import weather
let apiKey = "eab52e4b15607908ae3212e851e07600";
let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?&exclude=minutely,hourly&limit=3&units=metric&appid=${apiKey}`;
let geoEndpoint = `https://api.openweathermap.org/geo/1.0/reverse?appid=${apiKey}`;

function onSuccess(position) {
  if (navigator.geolocation) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let positionUrl = `${apiUrl}&lat=${lat}&lon=${lon}`;
    let geoApi = `${geoEndpoint}&lat=${lat}&lon=${lon}`;
    axios.get(positionUrl).then(displayTemp);
    axios.get(positionUrl).then(displayForecast);

    axios.get(geoApi).then(getCityName);
  }
}
function getCityName(response) {
  let cityHeading = document.querySelector("h1");
  cityHeading.innerHTML = `${response.data[0].name}, ${response.data[0].state}`;
}
function onError() {
  alert(`Unable to retrieve your location, please enter city`);
}
window.onload = navigator.geolocation.getCurrentPosition(onSuccess, onError);

let currentPosition = document.querySelector("#locationButton");
currentPosition.addEventListener("click", fetchLocation);

function fetchLocation() {
  navigator.geolocation.watchPosition(onSuccess, onError);
}

//Search City
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector(".bar");

  if (city.value.length <= 0) {
    alert(`Please enter city`);
    return null;
  } else {
    if (city.value.length > 0) {
      search(`${city.value}`);
    }
  }
}

let form = document.querySelector(".search-bar");
form.addEventListener("submit", handleSubmit);

function error() {
  if (200 !== response.status) {
    alert(
      "Sorry, looks like there was a problem. Status Code: " + response.status
    );
    return;
  }
}
function search(city) {
  let geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=3&appid=${apiKey}`;
  axios.get(geoUrl).then(getCoordinates).catch(error);
}

function getCoordinates(response) {
  let latitude = response.data[0].lat;
  let longitude = response.data[0].lon;
  let searchUrl = `${apiUrl}&lat=${latitude}&lon=${longitude}`;
  let location = document.querySelector("h1");
  location.innerHTML = `${response.data[0].name}, ${response.data[0].state}`;
  axios.get(searchUrl).then(displayTemp);
  axios.get(searchUrl).then(displayForecast);
}

function displayTemp(response) {
  var currentTemp = Math.round(response.data.current.temp);

  let trueTemp = document.querySelector("#today-wx");

  let chancePrecip = document.querySelector("#percentPrecip");
  let Humidity = document.querySelector("#percentHum");
  let windspeed = document.querySelector("#windspeed");
  let weather = document.querySelector("h4");
  let currentIcon = document.querySelector(".weather-icon");

  trueTemp.innerHTML = `${currentTemp}`;
  chancePrecip.innerHTML = `${Math.round(response.data.daily[0].pop)}%`;
  Humidity.innerHTML = `${response.data.current.humidity}%`;
  windspeed.innerHTML = `${Math.round(response.data.current.wind_speed)}km/h`;
  weather.innerHTML = `${response.data.current.weather[0].description}`;
  currentIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.current.weather[0].icon}@2x.png`
  );
  let weatherLoading = document.querySelector(".bg-color");
  weatherLoading.classList.remove("loading");
}
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(".forecast");
  let forecastHTML = `<div class="row fut-forecast">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 7) {
      let date = new Date(forecastDay.dt * 1000);
      let day = `${date.toLocaleString("en-US", { weekday: "short" })}`;
      forecastHTML =
        forecastHTML +
        `<div class="col wk-forecast">
              <h6 class="wk-Day">${day}</h6>
              <img src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png" class="wx-icon"/>
              <h6 class="wx-forecast">
                <span class="tempHigh temperature">${Math.round(
                  forecastDay.temp.max
                )}° | </span>
                <span class="tempLow temperature">${Math.round(
                  forecastDay.temp.min
                )}°</span>
              </h6>
            </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
