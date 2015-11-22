'use strict';

(function () {
    angular.module('myApp.announcement.browse', [
        'ui.router',
        'slick',
//        'angular-carousel',
//        'ng-virtual-keyboard',
//        'myApp.directive.slider',
        'myApp.filter.trustHtml',
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
                    $scope.slideInterval = 3000;
                    $scope.noWrapSlides = true;

                    var tick = function () {
                        $scope.clock = Date.now(); // get the current time
                        $timeout(tick, $scope.tickInterval); // reset the timer
                    };

                    $scope.number = [1, 2, 3, 4, 5, 6, 7, 8];
                    $scope.slickConfig1Loaded = true;
                    $scope.updateNumber1 = function () {
                        $scope.slickConfig1Loaded = false;
                        $scope.number1[2] = '123';
                        $scope.number1.push(Math.floor((Math.random() * 10) + 100));
                        $timeout(function () {
                            $scope.slickConfig1Loaded = true;
                        }, 5);
                    };
                    $scope.slickCurrentIndex = 0;
                    $scope.slickConfig = {
                        dots: true,
                        autoplay: true,
                        initialSlide: 3,
                        infinite: true,
                        autoplaySpeed: 1000,
                        method: {
                        },
                    };
                    // Start the timer
                    $timeout(tick, $scope.tickInterval);

                    $http.get(Routing.generate('get_announcements')).success(function (response) {
                        $scope.slides = response.announcements;
                    });


                    $scope.number = [{label: 1}, {label: 2}, {label: 3}, {label: 4}, {label: 5}, {label: 6}, {label: 7}, {label: 8}];
                    $scope.numberLoaded = true;
                    $scope.numberUpdate = function () {
                        $scope.numberLoaded = false; // disable slick

                        //number update

                        $scope.numberLoaded = true; // enable slick
                    };

//                    $scope.slides = [
//                        {
//                            title: "aw"
//                        },
//                        {
//                            title: "ew"
//                        }
//                    ];
                }]);



}());


