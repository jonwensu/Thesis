'use strict';
(function () {
    angular.module('myApp.map.show', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('map.show', {
                                url: "/show",
                                controller: "ShowMapCtrl",
                                templateUrl: constants.viewPath() + 'map/show/show.html',
                            });
                }])

            .controller('ShowMapCtrl', ["$scope", "$http", "$state", "Idle", "leafletData", function ($scope, $http, $state, Idle, leafletData) {

                    var Control = L.Control.extend({
                        onAdd: function (map) {
                            var container = L.DomUtil.create('div', 'custom-control');
                            container.innerHTML = '<a href="#" class="' + this.options.containerClass + '">' + this.options.innerHTML + '</a>';
                            L.DomEvent
                                    .on(container, 'click', L.DomEvent.stopPropagation)
                                    .on(container, 'click', L.DomEvent.preventDefault)
                                    .on(container, 'click', this.options.handler, map)
                                    .on(container, 'dblclick', L.DomEvent.stopPropagation);
                            return container;
                        }
                    });


                    var geojsonMarkerOptions = {
                        radius: 15,
                    };

                    $scope.$on("IdleTimeout", function () {
                        $state.go("board.show");
                        $('input.search-input').getkeyboard().close();
                    });
                    var center = {
                        lat: 10.730873,
                        lng: 122.547767,
                    };


                    angular.extend($scope, {
                        campus: {
                            lat: center.lat,
                            lng: center.lng,
                            zoom: 20,
                        },
                        tiles: {
                            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            options: {
                                attribution: "",
                                minZoom: 17,
                                maxZoom: 21,
                                maxNativeZoom: 19
                            }},
                        layers: {
                            baselayers: {
                                osm: {
                                    name: 'OpenStreetMap',
                                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                                    type: 'xyz',
                                    layerParams: {
                                        showOnSelector: false
                                    }
                                }
                            },
                            overlays: {
                            }
                        },
                        maxbounds: {
                            southWest: {
                                lat: 10.72725,
                                lng: 122.54493
                            },
                            northEast: {
                                lat: 10.73423,
                                lng: 122.55335
                            }
                        },
                        markers: {
                            currLocation: {
                                lat: center.lat,
                                lng: center.lng,
                                message: "You are here",
                                focus: true,
                                type: 'awesomeMarker',
                                icon: {
                                    type: 'awesomeMarker',
                                    icon: 'star',
                                    markerColor: 'red'

                                }
                            }
                        },
                        geojson: {
                            campus: {
                                data: campus,
                                pointToLayer: function (feature, latlng) {
                                    return L.circleMarker(latlng, geojsonMarkerOptions);
                                },
                                onEachFeature: function (feature, marker) {
                                    marker.bindPopup('<h4>' + feature.properties.name + '</h4>', {closeButton: true, closeOnClick: true, });
                                },
                                style: {
                                    fillOpacity: 0,
                                    opacity: 0
                                }
                            }
                        },
                        controls: {
                            custom: []
                        },
                    });


                    var backControl = new Control({
                        position: 'bottomleft',
                        innerHTML: '<i title="Back" data-toggle="tooltip" class="fa fa-arrow-left"></i>',
                        containerClass: "back-control",
                        handler: function () {
                            $state.go("board.show");
                        }
                    });
                    var locControl = new Control({
                        position: 'bottomleft',
                        innerHTML: '<i title="Locate" data-toggle="tooltip" class="fa fa-crosshairs"></i>',
                        containerClass: "loc-control",
                        handler: function () {
                            leafletData.getMap().then(function (map) {
                                map.panTo(center);
                            });
                        }
                    });

                    $scope.controls.custom.push(backControl);
                    $scope.controls.custom.push(locControl);
                    leafletData.getGeoJSON().then(function (geojson) {
                        leafletData.getMap().then(function (map) {
                            var attribution = map.attributionControl;
                            attribution.setPrefix("&copy; Leaflet");

                            L.control.search({
                                layer: geojson.campus,
                                propertyName: "name",
                                initial: false,
                                autoType: true,
                                zoom: 20,
                                circleLocation: false,
                                markerLocation: true,
                                markerIcon: new L.AwesomeMarkers.icon({icon: "arrow-down", prefix: "fa", markerColor: "blue"}),
                            })
                                    .on('search_expanded', function (e) {
                                        var searchControl = this;
                                        $('input.search-input').keyboard({
                                            layout: 'custom',
                                            customLayout: {
                                                'default': [
                                                    '1 2 3 4 5 6 7 8 9 0 {b}',
                                                    'Q W E R T Y U I O P',
                                                    'A S D F G H J K L',
                                                    '{s} Z X C V B N M {clear}',
                                                    '{space} {a}'
                                                ],
                                                'shift': [
                                                    '1 2 3 4 5 6 7 8 9 0 {b}',
                                                    '! @ # $ % & * ( ) - + = ^',
                                                    '{s} , . ? _ / \\ \' Ñ {clear}',
                                                    '{space} {a}'
                                                ]
                                            },
                                            display: {
                                                's': ' ',
                                                'clear': ' ',
                                                'b': ' ',
                                                'a': ' '
                                            },
                                            accepted: function (event, keyboard, el) {
                                                searchControl.collapse();
                                            },
                                            usePreview: false,
                                        });
                                        $('input.search-input').getkeyboard().reveal();

                                        $('input.search-input').on('keyboardChange', function (e) {
                                            searchControl.searchText($(e.target).val());
                                        });

                                    })
                                    .on('search_collapsed', function (e) {
                                        $('input.search-input').getkeyboard().close();
                                    })
                                    .on('search_locationfound', function (e) {
                                        this.collapse();
                                    })
                                    .addTo(map);

                            //                        L.Routing.control({
//                            // [...] See MapzenTurn-by-Turn API documentation for other options
//                            waypoints: [
//                                L.latLng(10.730873, 122.547767),
//                                L.latLng(10.730778, 122.548657)
//                            ],
//                            router: L.Routing.valhalla('valhalla-M5kvvS0', 'bicycle'),
//                            formatter: new L.Routing.Valhalla.Formatter(),
//                            summaryTemplate: '<div class="start">{name}</div><div class="info pedestrian">{distance}, {time}</div>',
//                            routeWhileDragging: false,
//                            geocoder: L.Control.Geocoder.nominatim()
//                        }).addTo(map);
                        });


                    });
//                    var expanded = false;
//                    $scope.$on('leafletDirectiveMap.layeradd', function () {
//                        $('input.search-input').focus(function (e) {
//                            expanded = !expanded
//                            if (expanded) {
//                                console.log("search control expanded");
//                            }
//                        });
//                    });






//                    var backControl = L.control.extend({
//                        options: {
//                            position: 'topLeft',
//                            innerHTML: '<i title="Back" data-toggle="tooltip" class="fa fa-arrow-left"></i>',
//                            handler: function () {
//                                $state.go('bulletinboard');
//                            },
//                        },
//                        onAdd: function (map) {
//                            var className = 'leaflet-control-back',
//                                    container = L.DomUtil.create('div', className + ' leaflet-bar');
//
//                            return container;
//                        }
//                    });

//
//                    var map = new ol.Map({
//                        layers: [
//                            openCycleMapLayer,
//                            openSeaMapLayer
//                        ],
//                        target: 'map',
//                        controls: ol.control.defaults({
//                            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
//                                collapsible: false
//                            })
//                        }),
//                        view: new ol.View({
//                            maxZoom: 17,
//                            center: [122.54882, 10.73034],
//                            zoom: 17,
//                            extent: [122.54174, 10.72552, 122.55590, 10.73486]
//                        })
//                    });

//                    var view = map.view;

//                    var constrainPan = function () {
//                        var visible = view.calculateExtent(map.getSize());
//                        var centre = view.getCenter();
//                        var delta;
//                        var adjust = false;
//                        if ((delta = extent[0] - visible[0]) > 0) {
//                            adjust = true;
//                            centre[0] += delta;
//                        } else if ((delta = extent[2] - visible[2]) < 0) {
//                            adjust = true;
//                            centre[0] += delta;
//                        }
//                        if ((delta = extent[1] - visible[1]) > 0) {
//                            adjust = true;
//                            centre[1] += delta;
//                        } else if ((delta = extent[3] - visible[3]) < 0) {
//                            adjust = true;
//                            centre[1] += delta;
//                        }
//                        if (adjust) {
//                            view.setCenter(centre);
//                        }
//                    };




//
//                    var map = new ol.Map('map');
//
//                    var osmUrl = 'file:///C:/Maperitive/Tiles/{z}/{x}/{y}.png';
//                    var osmAttrib = 'Map data © OpenStreetMap contributors';
//                    var osm = new ol.layer(osmUrl, {minZoom: 13, maxZoom: 16, attribution: osmAttrib});
//                    map.setView(new ol.LatLng(59.55, 30.09), 13);
//                    map.addLayer(osm);

//                    uiGmapGoogleMapApi.then(function (maps) {
//
//                        var center = {
//                            latitude: 10.73034,
//                            longitude: 122.54882
//                        };
//
//
//                        var allowedBounds = new maps.LatLngBounds(
//                                new maps.LatLng(10.73436, 122.55541),
//                                new maps.LatLng(10.72685, 122.54443)
//                                );
//
//                        var lastValidCenter = new maps.LatLng(center.latitude, center.longitude);
//
//                        $scope.map = {
//                            center: center,
//                            zoom: 18,
//                            options: {
//                                maxZoom: 20,
//                                minZoom: 17
//                            },
//                            events: {
//                                center_changed: function (map) {
//
//                                    if (allowedBounds.contains(map.getCenter())) {
//                                        lastValidCenter = map.getCenter();
//
//                                        return;
//                                    }
//// console.log('aw');
//                                    map.panTo(lastValidCenter);
//                                },
//                            }
//                        };
//                    });

//                    window.onload =
//                    $('input').click(function (e) {
//                        alert('aw');
//                    });
                }]);
}());