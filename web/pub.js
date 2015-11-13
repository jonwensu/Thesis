'use strict';

(function () {
    angular.module('pub', [
        'ui.router',
        'myApp.announcement.browse',
        'myApp.index',
        'myApp.user',
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
}());


