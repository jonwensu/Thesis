'use strict';

(function () {
    angular.module('myApp.directive.imgscale', [])
            .directive("scale", ["$timeout", function () {
                    return {
                        restrict: 'A',
                        link: function (scope, element, attrs) {
                            element.bind('load', function () {
                                element.imageScale({
                                    parent: $('#image-container'),
                                    rescaleOnResize: true
                                });
                            });
                        }
                    };
                }]);
}());