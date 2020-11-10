  // Define greymap layers
  var greymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

// Create a map object
var myMap = L.map("mapid", {
    center: [32.7767, -96.7970],
    zoom: 3
  });

// Add greymap tile layer to the map
greymap.addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

  L.geoJson(data, {
    pointToLayer: function(features, latlng) {
      return L.circleMarker(latlng);
    },
    style: createFeatures,
    onEachFeature: function(features, layer) {
      layer.bindPopup(
        "Magnitude: " + features.properties.mag + 
        "<br>Depth: " + features.geometry.coordinates[2] +
        "<br>Location: " + features.properties.place
        );
    }
  }).addTo(myMap);

  // Once we get a response, send the data.features object to the createFeatures function
  function createFeatures(features) {
    return {
      fillColor: chooseColor(features.geometry.coordinates[2]),
      color: "black",
      radius: chosenRadius(features.properties.mag),
      stroke: true,
      weight: 0.4,
      opacity: 1,
      fillOpacity: 1
    };
  
    // Setting the radius of magnitude
    function chosenRadius(magnitude) {
      return magnitude * 4;

    }

    // setting the color according to the number of magnitude reported
    function chooseColor(depth) {
      if (depth > 90) {
        return "#EA2C2C";
    } else if (depth > 70) {
        return "#EA822C";
    } else if (depth > 50) {
        return "#EA822C";
    } else if (depth > 30) {
        return "#EE9C00";
    } else if (depth > 10) {
        return "#D4EE00";
    } else {
        return "#98EE00";
    }
    }
  }

  // Create a legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 10, 20, 50, 100, 200, 500, 1000],
          labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(myMap);

}).addTo(myMap);