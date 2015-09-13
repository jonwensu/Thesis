'use strict';

(function () {
    angular.module('myApp.user.new', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('user.new', {
                                url: "/new",
                                controller: "NewUserCtrl",
                                templateUrl: constants.viewPath() + 'user/new/new.html',
                                data: {
                                    roles: ["SUPER_ADMIN"]
                                }
                            });
                }])

            .controller('NewUserCtrl', ["$scope", "$state", "userService", function ($scope, $state, userService) {

                    $scope.submit = function () {
                        userService.postUser($scope, $state);
                    }
                }]);



}());


