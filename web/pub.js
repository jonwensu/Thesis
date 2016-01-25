'use strict';

(function () {
    angular.module('pub', [
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'myApp.announcement.browse',
        'myApp.index',
        'myApp.user',
        'ngIdle',
        'yaru22.angular-timeago'
    ])
            .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
                    $urlRouterProvider.otherwise("/bulletinboard");
                    $stateProvider
                            .state('bull', {
                                url: "/",
                                abstract: true,
                                data: {
                                    roles: []
                                }
                            });
                }])
            .config(["IdleProvider", "KeepaliveProvider", function (IdleProvider, KeepaliveProvider) {
                    // 3 mins idle
                    IdleProvider.idle(180);
                    // 2 mins to refresh
                    IdleProvider.timeout(120);
                }])
            .run(['$rootScope', '$state', 'Idle', function ($rootScope, $state, Idle) {
                    $rootScope.$on('$stateChangeStart', function (e, toState, toParams) {
                        if (toState.name == "bulletinboard") {
                            Idle.watch();
                        }
                    });
                }])
}());


