//$(function(){

// create map
var map = new L.Map('map').setView([-40, -64], 4);

//create layers
var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer(osmUrl, {minZoom: 3, attribution: osmAttrib});
var osm2 = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 13, attribution: osmAttrib });
var ggl = new L.Google();
var baselayers = {"Satelital Google":ggl,"OpenStreetMap":osm};
var prov;
// add default layer
map.addLayer(ggl);

// create controls
var selector = L.control.layers(baselayers,{}).addTo(map);
L.control.minimap(osm2, { toggleDisplay: true }).addTo(map);

// create geojson layer
$.getJSON("provincias.json", function(data){ 
     prov = L.geoJson(data,{
           style: {
                 weight: 1,
                 opacity: 1,
                 color: 'white',
                 dashArray: '3',
                 fillOpacity: 0
           },
           onEachFeature: provEachFeature
     }).addTo(map);
     
     selector.addOverlay(prov,"Provincias");
});

// event functions
function provEachFeature(feature, layer){
      layer.on({
            mouseover: mouseoverHandler,
			mouseout: mouseoutHandler,
			click: clickHandler
      });
}

function mouseoverHandler(e) {
	var feature = e.target;
	// highlight feature
	feature.setStyle({
		weight: 2,
		color: '#D60000',
		dashArray: '',
		fillOpacity: 0.5
	});
	if (!L.Browser.ie && !L.Browser.opera) feature.bringToFront();
}

function mouseoutHandler(e) {
	//set default style
	prov.resetStyle(e.target);
}

function clickHandler(e) {
	//zoom to feature
	map.fitBounds(e.target.getBounds());
  	//remove mouseover handler
  	map.eachLayer(function(layer){
  		layer.off('mouseover', mouseoverHandler)
  	})
  	//set default style
  	prov.resetStyle(e.target);
}

//});