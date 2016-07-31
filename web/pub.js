'use strict';

(function () {
    angular.module('pub', [
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'myApp.map',
        'myApp.index',
        'myApp.board',
        'myApp.user',
        'myApp.announcement',
        'myApp.faculty',
        'ngIdle',
        'yaru22.angular-timeago',
        'leaflet-directive',
        'myApp.directive.imgscale',
        'ng.group',
        'angular-marquee'
    ])
            .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
                    $urlRouterProvider.otherwise("/board/show");
                    $stateProvider
                            .state('bull', {
                                url: "/",
                                abstract: true,
                            });
                }])
            .config(["IdleProvider", "KeepaliveProvider", function (IdleProvider, KeepaliveProvider) {
                    // consider as idle after 30 sec of no activity
                    IdleProvider.idle(30);
                    // wait 60 sec more after being idle
                    IdleProvider.timeout(60);
                }])
            .run(['$rootScope', '$state', 'Idle', function ($rootScope, $state, Idle) {
                    $rootScope.$on('$stateChangeStart', function (e, toState, toParams) {
                        Idle.watch();
                    });

                    $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
                        //save the previous state in a rootScope variable so that it's accessible from everywhere
                        $rootScope.previousState = from;
                    });
                }]);

}());


