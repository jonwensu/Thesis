angular.module('myApp.user', [
    'myApp.user.new',
    'myApp.user.browse',
    'myApp.user.show',
    'myApp.user.edit'
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('user', {
                            url: "/admin",
                            abstract: true,
                            parent: 'index',
                            templateUrl: constants.viewPath() + 'nestedbase.html',
                        });
            }])