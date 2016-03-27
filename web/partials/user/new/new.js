'use strict';

(function () {
    angular.module('myApp.user.new', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('user.new', {
                                url: "/new",
                                controller: "NewUserCtrl",
                                templateUrl: '/partials/user/new/new.html',
                                data: {
                                    roles: ["SUPER_ADMIN"]
                                }
                            });
                }])

            .controller('NewUserCtrl', ["$scope", "$state", "userService", "$rootScope", function ($scope, $state, userService, $rootScope) {

                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name);
                        } else {
                            $state.go("home");
                        }
                    };

                    $scope.submit = function () {
                        userService.postUser($scope, $state);
                    }
                }]);



}());


