'use strict';

(function (window, emr, OpenLayers, undefined) {
    var StorageImageTile = OpenLayers.Class(OpenLayers.Tile.Image, {
        crossOriginKeyword: 'Anonymous',
        _imageToDataUri: function (image) {
            var canvas = window.document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            return canvas.toDataURL('image/png');
        },
        onImageLoadWithCache: function () {
            if (this.storage) {
                this.storage.add(this._storageKey, this._imageToDataUri(this.imgDiv));
            }
            this.onImageLoad.apply(this, arguments);
        },
        renderTile: function () {
            var self = this;
            var xyz = this.layer.getXYZ(this.bounds);
            var key = xyz.z + ',' + xyz.y + ',' + xyz.x;
            var url = this.layer.getURL(this.bounds);
            if (this.storage) {
                this.storage.get(key, function (value) {
                    if (value) {
                        self.initImage(key, value, false);
                    } else {
                        self.initImage(key, url, true);
                    }
                }, function () {
                    self.initImage(key, url, true);
                });
            } else {
                self.initImage(key, url, false);
            }
        },
        initImage: function (key, url, cache) {
            this.layer.div.appendChild(this.getTile());
            this.events.triggerEvent(this._loadEvent);
            var img = this.getImage();

            this.stopLoading();
            if (cache) {
                OpenLayers.Event.observe(img, 'load',
                        OpenLayers.Function.bind(this.onImageLoadWithCache, this)
                        );
                this._storageKey = key;
            } else {
                OpenLayers.Event.observe(img, 'load',
                        OpenLayers.Function.bind(this.onImageLoad, this)
                        );
            }
            OpenLayers.Event.observe(img, 'error',
                    OpenLayers.Function.bind(this.onImageError, this)
                    );
            this.imageReloadAttempts = 0;
            this.setImgSrc(url);
        }
    });

    var StorageOSMLayer = OpenLayers.Class(OpenLayers.Layer.OSM, {
        async: true,
        tileClass: StorageImageTile,
        initialize: function (name, url, options) {
            OpenLayers.Layer.OSM.prototype.initialize.apply(this, arguments);
            this.tileOptions = OpenLayers.Util.extend({
                storage: options.storage
            }, this.options && this.options.tileOptions);
        },
        clone: function (obj) {
            if (obj == null) {
                obj = new StorageOSMLayer(this.name,
                        this.url,
                        this.getOptions());
            }

            obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);
            return obj;
        }
    });

    emr.on('mapLoad', function (storage) {
        var options = {
            maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
        };
        var map = new OpenLayers.Map('map');
        map.maxExtent = new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34);
        map.addLayer(new StorageOSMLayer(undefined, undefined, {storage: storage}));

        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);
        

        var size = new OpenLayers.Size(50, 50);
        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
        var icon = new OpenLayers.Icon(constants.webPath() + "offline_map/img/marker.png", size, offset);
        markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(122.54882, 10.73034), icon));
        markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(122.54882, 10.73034), icon.clone()));

        var fromProjection = new OpenLayers.Projection('EPSG:4326');
        var toProjection = new OpenLayers.Projection('EPSG:900913');
        var center = new OpenLayers.LonLat(122.54882, 10.73034).transform(fromProjection, toProjection);
        map.setCenter(center, 17);
  
    });
})(window, window.offlineMaps.eventManager, OpenLayers);