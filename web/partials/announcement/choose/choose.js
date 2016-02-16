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

            .controller('ChooseTypeCtrl', ["$scope", "$http", "$state", function ($scope, $http, $state) {


                }]);



}());


