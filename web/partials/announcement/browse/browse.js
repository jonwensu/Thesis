'use strict';

(function () {
    angular.module('myApp.announcement.browse', [
        'ui.router',
//        'ng-virtual-keyboard',
        'slickCarousel',
        'myApp.filter.trustHtml',
    ])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('announcement.browse', {
                                url: "/browse",
                                controller: "BrowseAnnouncementCtrl",
                                templateUrl: constants.viewPath() + 'announcement/browse/browse.html',
                            });
                }])
            .controller('BrowseAnnouncementCtrl', ["$scope", "$http", "$state", "$timeout", "Idle", 'timeAgo', function ($scope, $http, $state, $timeout, Idle, timeAgo) {

                    $scope.clock = "loading clock..."; // initialise the time variable
                    $scope.tickInterval = 1000; //ms
                    $scope.slideInterval = 3000;
                    $scope.logo = constants.webPath() + "pics/coe.png";
                    $scope.play = true;
                    $scope.webPath = constants.webPath();

                    $scope.mapUrl = Routing.generate("map_view");

                    var colors = ["#f3f2cb", "#eddde1", "#acdafa", "#b9e2cd", "#ceb6fa"];
                    var count = 0;
                    $scope.shuffColors = shuffle(colors);
                    $scope.currentIndex = 0;

                    var oneDay = 60 * 60 * 24;
                    timeAgo.settings.fullDateAfterSeconds = oneDay;

                    var tick = function () {
                        $scope.clock = Date.now(); // get the current time
                        $timeout(tick, $scope.tickInterval); // reset the timer
                    };



                    function shuffle(o) {
                        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
                            ;
                        return o;
                    }

                    function assignColor() {
                        count++;
                        count = count > $scope.shuffColors.length - 1 ? 0 : count;
                    }

                    $scope.slickConfigFor = {
                        dots: false,
                        arrows: false,
                        fade: true,
                        cssEase: 'linear',
                        infinite: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        asNavFor: '.slide-nav',
//                        autoplay: true,
//                        autoplaySpeed: 5000,
                        method: {
                        },
                        event: {
                            afterChange: function (event, slick, currentSlide, nextSlide) {
                                $scope.slickConfigNav.method.slickGoTo(currentSlide);
                                $scope.currentIndex = currentSlide;
                                assignColor();
                                $('.slider-for').css('background', $('.slider-nav .slick-current').css('background-color'));
                            },
                            init: function (event, slick) {
                                slick.slickGoTo($scope.currentIndex);
                            }
                        },
                    };

                    $scope.slickConfigNav = {
                        dots: false,
                        arrows: true,
                        autoplay: true,
                        infinite: true,
                        autoplaySpeed: 5000,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        centerMode: true,
                        asNavFor: '.slide-for',
                        pauseOnHover: true,
                        focusOnSelect: true,
                        method: {
                        },
                        event: {
                            afterChange: function (event, slick, currentSlide, nextSlide) {
                                $scope.slickConfigFor.method.slickGoTo(currentSlide);
                                $scope.play = true;
                                updateAutoplay();
                            },
                            init: function (event, slick) {
                                slick.slickGoTo($scope.currentIndex);
                                var c = 0;
                                $('.slider-nav .slick-slide').each(function (i, r) {
                                    $(r).css('background-color', $scope.shuffColors[c]);
                                    c++;
                                    c = c > $scope.shuffColors.length - 1 ? 0 : c;
                                });
                                $('.slider-for').css('background', $('.slider-nav .slick-current').css('background-color'));
                                 $("img.scale").imageScale({
                                     parent: $('#image-container'),
                                     rescaleOnResize: true
                                 });
                            }
                        },
                    };
                    // Start the timer  
                    $timeout(tick, $scope.tickInterval);

                    $scope.togglePlay = function () {
                        $scope.play = !$scope.play;

                        updateAutoplay();
                    }

                    function updateAutoplay() {
                        if ($scope.play)
                        {
                            $scope.slickConfigNav.method.slickPlay();
                        } else {
                            $scope.slickConfigNav.method.slickPause();
                        }
                    }

                    $scope.loaded = false;
                    $http.get(Routing.generate('get_announcements_visible', {id: 1})).success(function (response) {
                        $scope.slides = response.announcements;
                        $scope.loaded = true;
                    });

                    $scope.$on("IdleTimeout", function () {
                        $scope.updateSlides();
                        Idle.watch();
                    });
                    $scope.$on("IdleStart", function () {
                        $scope.play = true;
                        updateAutoplay();
                    });




                    $scope.updateSlides = function () {

                        $scope.loaded = false;

                        $('.slide-cont').fadeOut();
                        $('#spinner').fadeIn();

                        $http.get(Routing.generate('get_announcements_visible', {id: 1})).success(function (response) {
                            $scope.slides = response.announcements;
                            $scope.loaded = true;
                            $('#spinner').fadeOut();
                            $('.slide-cont').fadeIn();
                        });

                    };
                }]);



}());


