'use strict';

var StorageTileLayer = L.TileLayer.extend({
    _setUpTile: function (done, tile, value, blob) {
        tile.onload = L.bind(this._tileOnLoad, this, done, tile);
        tile.onerror = L.bind(this._tileOnError, this, done, tile);

        tile.src = value;
    },
    createTile: function (coords, done) {
        var tile = document.createElement('img');

        if (this.options.crossOrigin) {
            tile.crossOrigin = '';
        }

        /*
         Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
         http://www.w3.org/TR/WCAG20-TECHS/H67
         */
        tile.alt = '';

        var x = coords.x,
                y = this.options.tms ? this._globalTileRange.max.y - coords.y : coords.y,
                z = this._getZoomForUrl(),
                key = z + ',' + x + ',' + y,
                self = this;
        if (this.options.storage) {
            this.options.storage.get(key, function (err, value) {
                if (value) {
                    tile.src = value.v;
                    self._setUpTile(done, tile, value.v, true);
                } else {
                    self._setUpTile(done, tile, self.getTileUrl(coords));
                }
            });
        } else {
            self._setUpTile(done, tile, self.getTileUrl(coords));
        }

        return tile;
    }
});

var Control = L.Control.extend({
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.innerHTML = '<a href="#" class="leaflet-control-zoom-in">' + this.options.innerHTML + '</a>';
        L.DomEvent
                .on(container, 'click', L.DomEvent.stopPropagation)
                .on(container, 'click', L.DomEvent.preventDefault)
                .on(container, 'click', this.options.handler, map)
                .on(container, 'dblclick', L.DomEvent.stopPropagation);
        return container;
    }
});

var ajax = function (src, responseType, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.responseType = responseType || 'text';
    xhr.onload = function (err) {
        if (this.status == 200) {
            callback(this.response);
        }
    };
    xhr.send();
};

/*
 Probably btoa can work incorrect, you can override btoa with next example:
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding#Solution_.232_.E2.80.93_rewriting_atob%28%29_and_btoa%28%29_using_TypedArrays_and_UTF-8
 */
function arrayBufferToBase64ImagePNG(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    for (var i = 0, l = bytes.byteLength; i < l; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return 'data:image/png;base64,' + btoa(binary);
}

var dbname = 'tile';
var db = new PouchDB(dbname);
var center = [10.730873, 122.547767];
var map = L.map('map').setView(center, 19);

var geojsonOpts = {
    pointToLayer: function (feature, latlng) {
//        var name = feature.properties.name + "";
        return L.marker(latlng, {
            icon: L.divIcon({
                className: "my-div-icon",
                iconSize: L.point(16, 16),
                html: "",
            })
        });
    },
    style: {opacity: 0, fillOpacity: 0},
    onEachFeature: function (feature, marker) {
        marker.bindPopup('<h4>' + feature.properties.name + '</h4>', {closeButton: true, closeOnClick: true,});
    }
}
var markers = L.geoJson(campus, geojsonOpts).addTo(map);

var searchControl = L.control.search({
    layer: markers,
    initial: false,
    zoom: 20,
    propertyName: 'name',
    markerLocation: true,
    position: 'topleft',
    autoCollapse: true
});

map.addControl(searchControl);

// map bounds
var southWest = L.latLng(10.72758, 122.54462),
        northEast = L.latLng(10.73379, 122.55304),
        bounds = L.latLngBounds(southWest, northEast);


map.options.maxBounds = bounds;
new StorageTileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    storage: db,
    minZoom: 17,
    maxZoom: 20,
    maxNativeZoom: 19
}).addTo(map);
var board = Routing.generate("board_view");
//var from = center;
//var to = [10.730778, 122.548657];
//
//L.Routing.control({
//    waypoints: [
//        from,
//        to
//    ],
//    routeWhileDragging: true,
//}).addTo(map);

var marker = L.marker(center, {icon: L.AwesomeMarkers.icon({icon: "star", prefix: "fa", markerColor: "red"})}).addTo(map);
marker.bindPopup("<b>You are here</b>", {closeButton: false, closeOnClick: true, offset: L.point(0, -30)}).openPopup();

map.addControl(new Control({position: 'topleft', innerHTML: '<i title="Back" data-toggle="tooltip" class="fa fa-arrow-left"></i>', handler: function () {
        window.location.href = board;
    }}));
