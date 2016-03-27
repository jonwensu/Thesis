'use strict';
(function () {
    angular.module('myApp.map.show', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('map.show', {
                                url: "/show",
                                controller: "ShowMapCtrl",
                                templateUrl: '/partials/map/show/show.html',
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

                    $scope.$on("IdleStart", function () {
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

//                            L.Routing.control({
//                                waypoints: [
//                                    L.latLng(10.730873, 122.547767),
//                                    L.latLng(10.730778, 122.548657)
//                                ],
//                                router: L.Routing.valhalla('valhalla-M5kvvS0', 'bicycle'),
//                                formatter: new L.Routing.Valhalla.Formatter(),
//                                summaryTemplate: '<div class="start">{name}</div><div class="info pedestrian">{distance}, {time}</div>',
//                                routeWhileDragging: false,
//                                geocoder: L.Control.Geocoder.nominatim()
//                            }).addTo(map);
                        });


                    });
                }]);
}());