'use strict';

(function () {
    angular.module('myApp.announcement.browse', [
        'ui.router',
        'myApp.directive.slider',
        'myApp.filter.trustHtml'
    ])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('bulletinboard', {
                                url: "/bulletinboard",
                                controller: "BrowseAnnouncementCtrl",
                                templateUrl: constants.viewPath() + 'announcement/browse/browse.html',
                                data: {
                                    roles: ["ADMIN"]
                                }
                            });
                }])
            .controller('BrowseAnnouncementCtrl', ["$scope", "$http", "$state", "$timeout", function ($scope, $http, $state, $timeout) {

                    $scope.clock = "loading clock..."; // initialise the time variable
                    $scope.tickInterval = 1000; //ms

                    var tick = function () {
                        $scope.clock = Date.now(); // get the current time
                        $timeout(tick, $scope.tickInterval); // reset the timer
                    };

                    // Start the timer
                    $timeout(tick, $scope.tickInterval);
                    $http.get(Routing.generate('get_announcements')).success(function (response) {
                        $scope.slides = response.announcements;
                        console.log($scope.slides);
                    });

                }]);



}());


