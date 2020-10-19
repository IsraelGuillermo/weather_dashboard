var searchedCities = [];

function buildQuery() {
  var APIkey = "6384891c94809a3c5a57868fd8ab6033";
  var $cityName = $("#city-name").val().trim();
  var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?units=imperial&q=" +
    $cityName +
    "&appid=" +
    APIkey;
  return queryURL;
}
function buildForecastquery() {
  var $cityName = $("#city-name").val().trim();
  var APIkey = "6384891c94809a3c5a57868fd8ab6033";

  var queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" +
    $cityName +
    "&appid=" +
    APIkey;
  return queryURL;
}

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

function generateForecast(response) {
  $("#forecast").empty();
  var list = response.list;
  for (var i = 0; i < list.length; i++) {
    if (i % 8 === 0) {
      var div = $("<div>").addClass("card float-left ml-3 my-2 rounded pl-2");
      var h5 = $("<h5>").addClass("card-title");
      var p = $("<p>").addClass("card-text");
      var p1 = $("<p>").addClass("card-text");
      h5.text(list[i].dt_txt).appendTo(div);
      p.text(
        "Temperature: " + Math.floor(list[i].main.temp_min) + " °F"
      ).appendTo(div);
      p1.text("Humidity: " + Math.floor(list[i].main.humidity) + " %").appendTo(
        div
      );
      div.appendTo("#forecast");
    }
  }
}

renderButton();

function saveCities() {
  var citySearched = $("#city-name").val().trim();
  var cities = {
    city: citySearched,
  };
  searchedCities.push(cities);
  localStorage.setItem("searchCities", JSON.stringify(searchedCities));
}
function renderButton() {
  $("#buttons").empty();

  var cities = JSON.parse(localStorage.getItem("searchCities"));

  if (cities !== null) {
    searchedCities = cities;
    for (var i = 0; i < searchedCities.length; i++) {
      $("<button>")
        .text(searchedCities[i].city)
        .addClass("btn btn-primary mb-2")
        .appendTo("#buttons");
    }
  }
}
function displayInfo(response) {
  var weatherDiv = $("<div>").addClass("weatherInfo rounded pl-2");
  $("#main").empty();

  $("<h1>").text(response.name).appendTo(weatherDiv);
  $("<p>")
    .text("Temperatue: " + Math.floor(response.main.temp) + " °F")
    .appendTo(weatherDiv);
  $("<p>")
    .text("Humidity: " + response.main.humidity + " %")
    .appendTo(weatherDiv);
  $("<p>")
    .text("Wind Speed: " + response.wind.speed + "MPH")
    .appendTo(weatherDiv);
  $("<p>")
    .text("UV Index: " + response.wind.speed)
    .appendTo(weatherDiv);
  weatherDiv.appendTo("#main");
}

$(".btn-primary").on("click", function () {
  var APIkey = "6384891c94809a3c5a57868fd8ab6033";
  var $cityName = $(this).text();
  var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?units=imperial&q=" +
    $cityName +
    "&appid=" +
    APIkey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(displayInfo);
  var queryURL2 =
    "http://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" +
    $cityName +
    "&appid=" +
    APIkey;
  $.ajax({
    url: queryURL2,
    method: "GET",
  }).then(generateForecast);
});
