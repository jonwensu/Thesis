'use strict';

(function () {
    angular.module('myApp.directive.dropzone', [])
            .directive("dropzone", ["$timeout", function ($timeout) {
                    return {
                        restrict: 'C',
                        link: function (scope, element, attrs) {
                            var config = {
                                url: Routing.generate("upload"),
                                maxFilesize: 100,
                                paramName: 'uploadFile',
                                maxThumbnailFilesize: 10,
                                parallelUploads: 1,
                                autoProcessQueue: false,
                                dictDefaultMessage: "Drop file to upload (or click)"
                            };

                            var eventHandlers = {
                                'addedfile': function (file) {
                                    scope.file = file;
                                    if (this.files[1] != null) {
                                        this.removeFile(this.files[0]);
                                    }
                                    scope.$apply(function () {
                                        scope.fileAdded = true;
                                    });
                                },
                                'success': function (file, response) {
                                    var id = response.id;
                                    file.serverId = id;
                                }
                            };

                            var dropzone = new Dropzone(element[0], config);

                            angular.forEach(eventHandlers, function (handler, event) {
                                dropzone.on(event, handler);
                            });

                            scope.dropzoneEvent = function (event, handler) {
                                dropzone.on(event, handler);
                            };

                            scope.processDropzone = function () {
                                dropzone.processQueue();
                            };

                            scope.hasFile = function () {
                                return dropzone.getQueuedFiles().length > 0;
                            };

                            scope.setDropzoneUrl = function (url) {
                                dropzone.options.url = url;
                            };
                        }
                    };
                }]);
}());