'use strict';

(function () {
    angular.module('myApp.map.show', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('mapshow', {
                                url: "/show",
                                controller: "MapShowCtrl",
                                templateUrl: constants.viewPath() + 'map/show/show.html',
                            });
                }])

            .controller('MapShowCtrl', ["$scope", "$http", "$state", function ($scope, $http, $state) {

//                    angular.extend($scope, {
//                        cpu: {
//                            lat: 10.73034,
//                            lon: 122.54882,
//                            zoom: 17,
//                            centerUrlHash: true
//                        }
//                    });
//
//                    var promise;
//                    $scope.$on("centerUrlHash", function (event, centerHash) {
//                        $location.search({c: centerHash});
//                    });

//                    var layer = new OpenLayers.Layer.Vector("Polygon", {
//                        strategies: [new OpenLayers.Strategy.Fixed()],
//                        protocol: new OpenLayers.Protocol.HTTP({
//                            url: constants.webPath() + "maps/map.osm",
//                            format: new OpenLayers.Format.OSM()
//                        }),
//                        projection: new OpenLayers.Projection("EPSG:4326")
//                    });
//                    alert(constants.webPath());
//                    var map = new OpenLayers.Map("map", {
//                        controls: [
//                            new OpenLayers.Control.Navigation(),
//                            new OpenLayers.Control.PanZoomBar(),
//                            new OpenLayers.Control.Permalink(),
//                            new OpenLayers.Control.ScaleLine({geodesic: true}),
//                            new OpenLayers.Control.Permalink('permalink'),
//                            new OpenLayers.Control.MousePosition(),
//                            new OpenLayers.Control.Attribution()],
//                        maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
//                        maxResolution: 156543.0339,
//                        numZoomLevels: 19,
//                        units: 'm',
//                        projection: new OpenLayers.Projection("EPSG:900913"),
//                        displayProjection: new OpenLayers.Projection("EPSG:4326")
//                    });
//                    $scope.layers = {
//                        main: {
//                            type: "tile",
//                            source: {
//                                type: "OSM",
//                                url: "C:/Maperitive/Tiles/{z}/{x}/{y}.png",
////                                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                            }
//                        }
//                    };


//                    var openCycleMapLayer = new ol.layer.Tile({
//                        source: new ol.source.OSM({
//                            attributions: [
//                                new ol.Attribution({
//                                    html: 'All maps &copy; ' +
//                                            '<a href="http://www.opencyclemap.org/">OpenCycleMap</a>'
//                                }),
//                                ol.source.OSM.ATTRIBUTION
//                            ],
//                            url: 'http://localhost/Thesis/web/Tiles/{z}/{x}/{y}.png'
//                        })
//                    });
//
//                    var openSeaMapLayer = new ol.layer.Tile({
//                        source: new ol.source.OSM({
//                            attributions: [
//                                new ol.Attribution({
//                                    html: 'All maps &copy; ' +
//                                            '<a href="http://www.openseamap.org/">OpenSeaMap</a>'
//                                }),
//                                ol.source.OSM.ATTRIBUTION
//                            ],
//                            crossOrigin: null,
//                            url: 'http://localhost/Thesis/web/Tiles/{z}/{x}/{y}.png'
//                        })
//                    });
//
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

                }]);


}());