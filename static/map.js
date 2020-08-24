mapboxgl.accessToken = 'pk.eyJ1IjoidGFiYXJvIiwiYSI6ImNrOTRyZnNuZzBjNXMzbXFleWd2eGo2eDgifQ.YMIlqD-cLZg4EVMqO0J1fw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [15.5333, -4.5167], // starting position
    zoom: 9, // starting zoom
});

var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/mapbox/' + layerId);
}

for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}