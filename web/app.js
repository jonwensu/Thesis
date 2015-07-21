'use strict';

(function () {
    var myApp = angular.module('myApp', [
        'ui.router',
        'ngAnimate',
        'ui.tinymce',
        'myApp.announcement',
        'myApp.user',
        'myApp.directive.compareTo'
    ])
            .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

                    $urlRouterProvider.otherwise("/");

                    $stateProvider.state('home', {
                        url: "/",
                        controller: "MainCtrl",
                        templateUrl: PATH + "index.html"
                    });
                }])
            .config(['$httpProvider', function ($httpProvider) {
                    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
                }])
            .controller("MainCtrl", ["$scope", function ($scope) {
                    $scope.message = "asaa";

                    $('.btn-minimize').click(function (e) {
                        e.preventDefault();

                        var $target = $(this).parent().parent().next('.box-content');
                        if ($target.is(':visible'))
                            $('i', $(this)).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                        else
                            $('i', $(this)).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                        $target.slideToggle();
                    });

                }])
}());


