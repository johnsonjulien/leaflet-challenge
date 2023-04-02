// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    console.log(data);
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });

   // Create function for marker size based on magnitude (greater mag = larger marker)
   function markerSize(magnitude) {
    return magnitude * 4000;
};

  // Create function for depth (deeper = darker color)
    function chooseColor(depth) {
        if (depth < 10) return "d4c2ef";
        else if (depth < 25) return "a986ff";
        else if (depth < 50) return "7e64bf";
        else if (depth < 75) return "3c08be";
        else if (depth < 100) return "29067f";
        else return "1e045f";
    }

    function createFeatures(earthquakeData) {

//   // Define a function that we want to run once for each feature in the features array.
//     // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
      }

//        // Create a GeoJSON layer that contains the features array on the earthquakeData object.
//   // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    pointToLayer: function(feature, latlng) {

    var markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 1.0,
        stroke: true,
        weight: 0.5
        }
        return L.circle(latlng,markers);
        }
    });
 
    // Create the map, then create function for eqrthquake layer
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the tile layer for background
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    
      var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });
    
      // Create a baseMaps object.
      var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
      };
    
      // Create an overlay object to hold our overlay.
      var overlayMaps = {
        Earthquakes: earthquakes
      };

// Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      38.74, -22.46],
    zoom: 1.5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
  }).addTo(myMap);

    // Create legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function () {

        var div = L.DomUtil.create("div", "info legend"),
        depth = [-10, 25, 50, 75, 100];
  
        div.innerHTML += "<h3 style = 'text-align: center'>Depth</h3>"
        
        for (var i = 0; i < depth.length; i++) {

            div.innerHTML += 
            '<i style="background:' + markerColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i +1] ? '&nbsp;' + depth[i + 1] + '<br>' : '+');
        }   
    return div;
    };
    legend.addTo(map);
    
  };
