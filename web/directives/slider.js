'use strict';

(function () {

    angular.module('myApp.directive.slider', [])
            .directive("bxslider", ["$timeout", function ($timeout) {
                    return {
                        restrict: 'A',
//                        templateUrl: constants.webPath() + "dirTemplates/slider.html",
                        link: function (scope, element, attr) {
                            if (scope.$last === true) {
                                $timeout(function () {
                                    scope.$emit('ngRepeatFinished');
                                    var def = constants.webPath() + "bg/default.jpg";
                                    $('.sl').css('background-image', "url(" + def + ")");
                                    var slider = $('.slider').bxSlider({
                                        slideWidth: 1000,
                                        minSlides: 1,
                                        maxSlides: 1,
                                        moveSlides: 1,
                                        slideMargin: 10,
                                        auto: true,
                                        speed: 1000,
                                        pause: 5000,
                                        autoHover: true,
                                        pager:false,
                                        onSlideAfter: function () {
                                            setTimeout(function () {
                                                slider.stopAuto();
                                                slider.startAuto();
                                            }, 10000);
                                        }
                                    });

                                });
                            }
                        }
                    };
                }])

}());


