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

$("#search").on("click", function () {
  event.preventDefault();
  var queryURL = buildQuery();
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(displayInfo);
  saveCities();
  renderButton();
});
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
  searchedCities = cities;
  if (cities !== null) {
    searchedCities = cities;
    for (var i = 0; i < searchedCities.length; i++) {
      $("<button>")
        .text(searchedCities[i].city)
        .addClass("btn btn-primary")
        .appendTo("#buttons");
    }
  }
}
function displayInfo(response) {
  $("#weather-info").empty();
  $("<h1>").text(response.name).appendTo("#weather-info");
  $("<p>")
    .text("Temperatue: " + Math.floor(response.main.temp) + " °F")
    .appendTo("#weather-info");
  $("<p>")
    .text("Humidity: " + response.main.humidity + " %")
    .appendTo("#weather-info");
  $("<p>")
    .text("Wind Speed: " + response.wind.speed + "MPH")
    .appendTo("#weather-info");
  $("<p>")
    .text("UV Index: " + response.wind.speed)
    .appendTo("#weather-info");
}

$("btn-primary").on("click", function () {
  alert("hi");
});
