// Creating map object
var map = L.map("map", {
  center: [40.0, -110.0],
  zoom: 4.5,
});

const API_KEY =
  "pk.eyJ1IjoiYXJvc25lcjkyIiwiYSI6ImNrYWJreGY1YjE3NzIyeHFmeXowbndreHUifQ.qfo7OSx20iihekfU2NEW5Q";

// Adding tile layer
var grayMap = L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY,
  }
);

grayMap.addTo(map);

var link =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, function (data) {
  console.log(data);
  var featuresarray = data.features;

  for (var i = 0; i < featuresarray.length; i++) {
    var mycoordinates = featuresarray[i].geometry.coordinates;
    var magnitude = featuresarray[i].properties.mag;
    var mysize = magnitude * 11000;
    var myplace = featuresarray[i].properties.place;
    var mytype = featuresarray[i].properties.type;
    var color = "";

    if (mysize > 55000) {
      color = "#FF0000";
    } else if (mysize > 44000) {
      color = "#FFA500";
    } else if (mysize > 33000) {
      color = "#EA9700";
    } else if (mysize > 22000) {
      color = "#E9CC1F";
    } else if (mysize > 11000) {
      color = "#D0E713";
    } else {
      color = "#AFFD00";
    }

    L.circle([mycoordinates[1], mycoordinates[0]], {
      stroke: true,
      fillOpacity: 0.5,
      color: "black",
      weight: 0.25,
      fillColor: color,
      radius: mysize,
    })
      .bindPopup(
        "<h1>" +
          mytype +
          "</h1> <hr> <h3>Magnitude: " +
          magnitude +
          "</h3> <hr> <h3>Place: " +
          myplace +
          "</h3>"
      )
      .addTo(map);
  }

  // Function to determine color based on magnitude
  function getColor(d) {
    return d > 5
      ? "#FF0000"
      : d > 4
      ? "#FFA500"
      : d > 3
      ? "#EA9700"
      : d > 2
      ? "#E9CC1F"
      : d > 1
      ? "#D0E713"
      : "#AFFD00";
  }
  // Create legend control object
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];

    // Loop through density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        getColor(grades[i] + 1) +
        '"></i> ' +
        grades[i] +
        (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Add legend to map
  legend.addTo(map);
});
