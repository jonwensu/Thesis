'use strict';

(function () {
    angular.module('myApp.announcement.browse', [
        'ui.router',
//        'angular-carousel',
//        'ng-virtual-keyboard',
//        'myApp.directive.slider',
//        'myApp.directive.slick',
        'slickCarousel',
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
                    $scope.slickConfigFor = {
                        dots: false,
                        arrows: false,
                        fade: true,
                        cssEase: 'linear',
                        infinite: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        centerMode: true,
                        centerPadding: '60px',
                        asNavFor: '.slide-nav',
                        pauseOnHover: true,
                        method: {
                        },
                    };
                    $scope.slickConfigNav = {
                        dots: false,
                        arrows: true,
                        autoplay: true,
                        infinite: true,
                        autoplaySpeed: 5000,
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        centerMode: true,
                        centerPadding: '10px',
                        asNavFor: '.slide-for',
                        pauseOnHover: true,
                        focusOnSelect: true,
                        prevArrow: $('.prev'),
                        nextArrow: $('.next'),
                        event: {
                            afterChange: function (event, slick, currentSlide, nextSlide) {
                                $scope.slickConfigFor.method.slickGoTo(currentSlide);
                            }
                        },
                        method: {
                        },
                    };
                    // Start the timer  
                    $timeout(tick, $scope.tickInterval);

                    $scope.loaded = false;
                    $http.get(Routing.generate('get_announcements')).success(function (response) {
                        $scope.slides = response.announcements;
                        $scope.loaded = true;
                    });

                }]);



}());


