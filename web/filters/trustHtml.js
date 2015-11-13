'use strict';

(function () {

    angular.module('myApp.filter.trustHtml', [])
            .filter('to_trusted', ['$sce', function ($sce) {
                    return function (text) {
                        return $sce.trustAsHtml(text);
                    };
                }]);

}());