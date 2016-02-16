'use strict';

(function () {
    angular.module('pub', [
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'myApp.announcement.browse',
        'myApp.map.show',
        'myApp.index',
        'myApp.user',
        'ngIdle',
        'yaru22.angular-timeago',
        'leaflet-directive'
    ])
            .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
                    $urlRouterProvider.otherwise("/bulletinboard");
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
                }])
}());


