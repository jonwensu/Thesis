'use strict';

(function () {
    angular.module('myApp.announcement.choose', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('announcement.choose', {
                                url: "/choose/type",
                                controller: "ChooseTypeCtrl",
                                templateUrl: constants.viewPath() + 'announcement/choose/choose.html',
                                data: {
                                    roles: ["ADMIN"]
                                }
                            });
                }])

            .controller('ChooseTypeCtrl', ["$scope", "$http", "$state", "$rootScope", function ($scope, $http, $state, $rootScope) {

                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name);
                        } else {
                            $state.go("home");
                        }
                    };
                }]);



}());


