var searchedCities = [];

$("#search").on("click", function () {
  buildQuery();
});

function buildQuery() {
  var APIkey = "6384891c94809a3c5a57868fd8ab6033";
  var queryURL =
    "api.openweathermap.org/data/2.5/weather?q=" +
    $cityName +
    "&appid=" +
    APIkey;
  var $cityName = $("#city-name").val().trim();
  searchedCities.push($cityName);
  console.log(searchedCities);
}
