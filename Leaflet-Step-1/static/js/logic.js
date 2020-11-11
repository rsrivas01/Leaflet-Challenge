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

  // Add a GeoJson layer
  L.geoJson(data, {
    pointToLayer: function(features, latlng) {
      return L.circleMarker(latlng);
    },
    style: createFeatures,
    // Create popup
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
        return "#253494";
    } else if (depth > 70) {
        return "#2c7fb8";
    } else if (depth > 50) {
        return "#41b6c4";
    } else if (depth > 30) {
        return "#7fcdbb";
    } else if (depth > 10) {
        return "#c7e9b4";
    } else {
        return "#ffffcc";
    }
    }
  }

  // Create a legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [-10, 10, 30, 50, 70, 90],
          colors = ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"];

      // loop through our density intervals and generate a colored label square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colors[i] + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(myMap);

}).addTo(myMap);