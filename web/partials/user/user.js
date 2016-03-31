angular.module('myApp.user', [
    'myApp.user.new',
    'myApp.user.browse',
    'myApp.user.show',
    'myApp.user.edit'
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('user', {
                            url: "/encoder",
                            abstract: true,
                            parent: 'index',
                            templateUrl: '/partials/nestedbase.html',
                        });
            }])