'use strict';

(function () {

    angular.module('myApp.directive.slider', [])
            .directive("bxslider", ["$timeout", "$http", function ($timeout, $http) {

                    var sliderOpt = {
                        slideWidth: 1000,
                        minSlides: 1,
                        maxSlides: 1,
                        moveSlides: 1,
                        slideMargin: 10,
                        auto: true,
                        speed: 1000,
                        pause: 5000,
                        autoHover: true,
                        pager: false,
                        onSlideAfter: function () {
                            setTimeout(function () {
                                slider.stopAuto();
                                slider.startAuto();
                            }, 10000);
                        }
                    };

                    return {
                        restrict: 'A',
                        require: 'bxslider',
                        priority: 0,
                        link: function (scope, element, attr, ctrl) {

                            var slider;
                            ctrl.update = function () {
                                slider && slider.destroySlider();
                                slider = element.bxSlider(sliderOpt);
                                $http.get(Routing.generate('get_announcements')).success(function (response) {
                                    scope.slides = response.announcements;
                                });
                            };
                        }
                    };
                }])
            .directive("bxsliderItem", ["$timeout", function ($timeout) {
                    return {
                        require: '^bxslider',
                        link: function (scope, elm, attr, bxSliderCtrl) {
                            if (scope.$last) {
                                $timeout(bxSliderCtrl.update(), 1);
                            }
                        }
                    }
                }])

}());


