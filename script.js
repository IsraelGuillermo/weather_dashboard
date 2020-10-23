// Empty array to add cities searched
var searchedCities = [];
var moment = moment();
var today = moment.format("dddd Do MMMM, YYYY");
var APIkey = "6384891c94809a3c5a57868fd8ab6033";

// This function builds the URL query for current weather
function buildQuery() {
  var $cityName = $("#city-name").val().trim();
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" +
    $cityName +
    "&appid=" +
    APIkey;
  return queryURL;
}
// This function builds URL query for forecast information
function buildForecastquery() {
  var $cityName = $("#city-name").val().trim();

  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" +
    $cityName +
    "&appid=" +
    APIkey;
  return queryURL;
}
// When search is done, this function gets information back from openweather API

$("#search").on("click", function () {
  event.preventDefault();

  var queryURL = buildQuery();
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(displayInfo);
  saveCities();
  renderButton();
  var queryURL2 = buildForecastquery();
  $.ajax({
    url: queryURL2,
    method: "GET",
  }).then(generateForecast);
});

// This function generates the 5 day forecast. Creates divs and appends to forecast div
function generateForecast(response) {
  $("#forecast").empty();
  $("<h1>").text("5-Day Forecast:").addClass("mx-3").appendTo("#forecast");
  var list = response.list;

  for (var i = 0; i < list.length; i++) {
    if (i % 8 === 0) {
      function generateImg(response) {
        var icon = response.list[i].weather[0].icon;
        var imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        return imageURL;
      }
      var imgUrl = generateImg(response);

      var div = $("<div>").addClass("card float-left mx-4 my-2 rounded");
      var h5 = $("<h5>").addClass("card-title");
      var p = $("<p>").addClass("card-text");
      var p1 = $("<p>").addClass("card-text");
      h5.text(new Date(list[i].dt_txt).toLocaleDateString()).appendTo(div);
      p.text(
        "Temperature: " + Math.floor(list[i].main.temp_min) + " °F"
      ).appendTo(div);
      p1.text("Humidity: " + Math.floor(list[i].main.humidity) + " %").appendTo(
        div
      );
      $("<img>").attr("src", imgUrl).appendTo(div);

      div.appendTo("#forecast");
    }
  }
}
// Calling this function allows system to generate buttons for cities which were searched
renderButton();

// Function saves searched cities to local storage
function saveCities() {
  var citySearched = $("#city-name").val().trim();
  var cities = {
    city: citySearched,
  };
  searchedCities.push(cities);
  localStorage.setItem("searchCities", JSON.stringify(searchedCities));
}

// This function createds a button for every city that has been searched
function renderButton() {
  $("#buttons").empty();

  var cities = JSON.parse(localStorage.getItem("searchCities"));

  if (cities !== null) {
    searchedCities = cities;
    for (var i = 0; i < searchedCities.length; i++) {
      $("<button>")
        .text(searchedCities[i].city)
        .addClass("btn btn-primary mb-2")
        .prependTo("#buttons");
    }
  }
}

// This function generates original current data information for city which is searched
function displayInfo(response) {
  $("#main").empty();
  function generateImg(response) {
    var icon = response.weather[0].icon;
    var imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    return imageURL;
  }
  var imgUrl = generateImg(response);
  $("#main").addClass("weatherInfo rounded my-4 px-4");

  $("<h1>")
    .text(response.name + " " + today)
    .appendTo("#main");
  $("<img>").attr("src", imgUrl).appendTo("#main");

  $("<p>")
    .text("Temperatue: " + Math.floor(response.main.temp) + " °F")
    .appendTo("#main");
  $("<p>")
    .text("Humidity: " + response.main.humidity + " %")
    .appendTo("#main");
  $("<p>")
    .text("Wind Speed: " + response.wind.speed + "MPH")
    .appendTo("#main");

  UV(response.coord.lat, response.coord.lon);
}

// Function which gets UV index and displays it on main, also displays background color based on level of UV index

function UV(lat, lon) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    APIkey;
  var uvIndex;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    uvIndex = response.value;
    if (uvIndex < 2) {
      $("<p>")
        .text("UV Index: " + uvIndex)
        .addClass("weatherInfo green")
        .appendTo("#main");
    } else if (uvIndex < 8) {
      $("<p>")
        .text("UV Index: " + uvIndex)
        .addClass("weatherInfo orange")
        .appendTo("#main");
    } else {
      $("<p>")
        .text("UV Index: " + uvIndex)
        .addClass("weatherInfo red")
        .appendTo("#main");
    }
  });
  return uvIndex;
}
// This function targets buttons which were created when a city was searched. It displays current and forecast weather information
$(".btn-primary").on("click", function () {
  var APIkey = "6384891c94809a3c5a57868fd8ab6033";
  var $cityName = $(this).text();
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" +
    $cityName +
    "&appid=" +
    APIkey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(displayInfo);
  var queryURL2 =
    "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" +
    $cityName +
    "&appid=" +
    APIkey;
  $.ajax({
    url: queryURL2,
    method: "GET",
  }).then(generateForecast);
});
