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
  let formattedDate = `${day}, ${month} ${date}, ${year}   <small>Last updated at </small>${twelveHr}:${minute} ${amPm}`;
  return formattedDate;
}
let today = formatDate(new Date());
let h2 = document.querySelector("h2");
h2.innerHTML = `${today}`;
//loop days of the week for forecast
function getLabel(day) {
  let forecastDay = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  for (let i = 0; i < forecastDay.length; i++) {
    let name = forecastDay[(day.getDay() + i) % 7];
    let dayName = document.querySelectorAll(".wk-Day");
    dayName[i].innerHTML = `${name}`;
  }
}
getLabel(new Date());
//import weather
let apiKey = "eab52e4b15607908ae3212e851e07600";
let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?&exclude=minutely,hourly&limit=3&units=metric&appid=${apiKey}`;

function onSuccess(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let positionUrl = `${apiUrl}&lat=${lat}&lon=${lon}`;
  axios.get(positionUrl).then(displayTemp);
}
function onError(error) {
  if (!navigator.geolocation || error.code === error.PERMISSION_DENIED) {
    alert(`Unable to retrieve your location, please enter city`);
  }
}
window.onload = navigator.geolocation.getCurrentPosition(onSuccess, onError);

let currentPosition = document.querySelector("#locationButton");
currentPosition.addEventListener("click", fetchLocation);
function fetchLocation() {
  navigator.geolocation.watchPosition(onSuccess, onError);
}

//Search City
function search(event) {
  event.preventDefault();
  let city = document.querySelector(".bar");
  let location = document.querySelector("h1");
  location.innerHTML = `${city.value}`;
  let geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location.innerHTML}&appid=${apiKey}`;
  axios.get(geoUrl).then(getCoordinates);
}
let form = document.querySelector(".search-bar");
form.addEventListener("submit", search);

function getCoordinates(response) {
  let latitude = response.data[0].lat;
  let longitude = response.data[0].lon;
  let searchUrl = `${apiUrl}&lat=${latitude}&lon=${longitude}`;
  axios.get(searchUrl).then(displayTemp);
}

function displayTemp(response) {
  console.log(response.data);
  var currentTemp = Math.round(response.data.current.temp);
  currentTempLink = currentTemp;

  let trueTemp = document.querySelector("#today-wx");
  trueTemp.innerHTML = `${currentTemp}`;
  let currentIcon = document.querySelector(".weather-icon");
  currentIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.current.weather[0].icon}@2x.png`
  );

  //precipitation
  let precip = Math.round(response.data.daily[0].pop);
  let chancePrecip = document.querySelector("#percentPrecip");
  chancePrecip.innerHTML = `${precip}%`;
  //humidity
  let percentHumidity = response.data.current.humidity;
  let Humidity = document.querySelector("#percentHum");
  Humidity.innerHTML = `${percentHumidity}%`;
  //windspeed
  let wind = Math.round(response.data.current.wind_speed);
  let windspeed = document.querySelector("#windspeed");
  windspeed.innerHTML = `${wind}km/h`;
  //description
  let description = response.data.current.weather[0].description;
  let weather = document.querySelector("h4");
  weather.innerHTML = `${description}`;
  //loop through daily array
  for (let i = 0; i < 7; i++) {
    let forecastTempHigh = Math.round(response.data.daily[i].temp.max);
    let forecastTempLow = Math.round(response.data.daily[i].temp.min);
    let dailyTempHigh = document.querySelectorAll(".tempHigh");
    let dailyTempLow = document.querySelectorAll(".tempLow");
    dailyTempHigh[i].innerHTML = `${forecastTempHigh}° |`;
    dailyTempLow[i].innerHTML = ` ${forecastTempLow}°`;
    let dailyIcon = document.querySelectorAll(".wx-icon");
    dailyIcon[i].setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.daily[i].weather[0].icon}@2x.png`
    );
  }
}
function displayFahrenheitTemp(event) {
  event.preventDefault();
  let fahrenheitTemp = document.querySelector("#today-wx");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitCalc = Math.round((currentTempLink * 9) / 5 + 32);

  fahrenheitTemp.innerHTML = `${fahrenheitCalc}`;
}

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

function displayCelsiusTemp(event) {
  event.preventDefault();
  let celsiusTemp = document.querySelector("#today-wx");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  celsiusTemp.innerHTML = `${currentTempLink}`;
}
let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsiusTemp);
