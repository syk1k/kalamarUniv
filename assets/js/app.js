(function () {
    // Creation of the base layers

    var univSearch = [];

    var options = {
        valueNames:['name']
    };



    var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    });

    var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
    });

    var mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'streets-v9',
        accessToken: 'pk.eyJ1Ijoic3lrMWsiLCJhIjoiY2plb2JqMHllNGYydjJ3cGVmMnE2aHlkYSJ9.uXv_J38Ndp0_aHJ0r9zP4A'
    });

    // Creation of the overlays

    var univLayer = L.geoJSON(univ, {
        onEachFeature : function (feature, layer) {
            layer.bindPopup(feature.properties.name);
            layer.on({
                click : function () {
                    map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
                }
            });
            univSearch.push({name:layer.feature.properties.name});
            $("#univList tbody").append("<tr class='feature-row' id="+L.stamp(layer)+" lat="+layer.getLatLng().lat+" long="+layer.getLatLng().lng+">"+"<td class='bg-light name'>"+layer.feature.properties.name+"</td>"+"</tr>");
        }
    });

    var sideBarUnivList = new List("univList", options);

    // Creation of the markercluster to hold all markers
    var markers = new L.markerClusterGroup();
    markers.addLayer(univLayer);

    var map = L.map("map", {
        center : [8.695, 2.395],
        zoom : 7,
        zoomControl: false,
        attributionControl: false,
        layers: [osm, markers]
    });

    L.marker([50.5, 30.5]).addTo(map);

    var baseMaps = {
        "OpenStreetMap": osm,
        "CartoDB": cartoLight,
        "MapBox": mapbox
    };

    var overlayMaps = {
        "Universities": markers
    };

    var controlOptions = {
        collapsed : false
    };

    // Creation of the layer Control
	L.control.layers(baseMaps,overlayMaps, controlOptions).addTo(map);
	
	// Creation of a zoom Controle and adding it to the map
	L.control.zoom({
		position: 'bottomleft'
	}).addTo(map);
	
	// Creation of the attribution controle and adding it to the map
	L.control.attribution({
		prefix: '<a href="kalamar.tg">Kalamar</a>'
	}).addTo(map);
	
	// Manage the event on Click to the sidebar
	
	function sidebarClick(id){ // This function exexute the click on a layer specifically by the id
		var layer = markers.getLayer(id);
		map.setView([layer.getLatLng().lat, layer.getLatLng().lng, 17]);
		layer.fire('click');
	}
	
	$(document).on("click", ".feature-row", function(e) { // This function execute a click on the document take the id of the element Clicked and pass it to the sidebarClick function
		sidebarClick(parseInt($(this).attr("id"), 10));
	});

	

})();
