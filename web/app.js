'use strict';
(function () {
    var myApp = angular.module('myApp', [
        'ui.router',
        'ngAnimate',
        'ui.tinymce',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ui.grid',
        'ui.checkbox',
        'myApp.announcement',
        'myApp.user',
        'myApp.college',
        'myApp.department',
        'myApp.faculty',
        'myApp.service.user',
        'myApp.service.authorization',
        'myApp.index',
        'myApp.service.principal',
        'ngIdle',
        'yaru22.angular-timeago',
        'myApp.directive.imgscale',
    ])
            .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

                    $urlRouterProvider.otherwise("/");
                    $stateProvider.state('home', {
                        url: "/",
                        controller: "MainCtrl",
                        parent: 'index',
                        templateUrl:  "/partials/index.html",
                        data: {
                            roles: ["ADMIN"]
                        }
                    });
                }])
            .config(['$httpProvider', function ($httpProvider) {
                    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
                }])
            .config(["IdleProvider", "KeepaliveProvider", function (IdleProvider, KeepaliveProvider) {
                    IdleProvider.idle(180);
                    IdleProvider.timeout(120);
                }])
            .run(['$rootScope', 'authorization', 'principal', 'Idle', function ($rootScope, authorization, principal, Idle) {

                    $rootScope.$on('$stateChangeStart', function (e, toState, toParams) {
                        $rootScope.toState = toState;
                        $rootScope.toParams = toParams;

                        Idle.watch();

                        $rootScope.$on('IdleTimeout', function () {
                            window.location.href = Routing.generate('fos_user_security_logout');
                        });

                        if (principal.isIdentityResolved())
                            authorization.authorize();
                    });


                    $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
                        $rootScope.previousState = from;
                        $rootScope.previousStateParams = fromParams;
                    });
                }])
            .controller("MainCtrl", ["$scope", "$rootScope", "$http", "$timeout", "uiGridConstants", function ($scope, $rootScope, $http, $timeout, uiGridConstants) {

                    $scope.id = $rootScope.id;

                    $('#spinner').show();

                    $scope.clock = "loading clock..."; // initialise the time variable
                    $scope.tickInterval = 1000; //ms

                    $http.get(Routing.generate("get_announcements_overview"))
                            .then(function (response) {
                                $('#spinner').fadeOut(500);
                                $scope.encoded = response.data.encoded;
                                $scope.all = response.data.all;
                            });

                    var tick = function () {
                        $scope.clock = Date.now(); // get the current time
                        $timeout(tick, $scope.tickInterval); // reset the timer
                    };

                    // Start the timer  
                    $timeout(tick, $scope.tickInterval);


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


