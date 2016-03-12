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
        'ng.group'
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
                    // 3 mins idle
                    IdleProvider.idle(60);
                    // 2 mins to refresh
                    IdleProvider.timeout(240);
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


