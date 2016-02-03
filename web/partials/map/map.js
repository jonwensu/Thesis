angular.module('myApp.map', [
    'myApp.map.show',
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('map', {
                            url: "/map",
                            abstract: true,
                            parent: 'index',
                            templateUrl: constants.viewPath() + 'nestedbase.html',
                        });
            }])