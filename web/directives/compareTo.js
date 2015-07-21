'use strict';

(function () {
    var compareTo = function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue && modelValue != null && scope.otherModelValue != null;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    };
    angular.module('myApp.directive.compareTo', [])
            .directive("compareTo", compareTo);
}());


