angular.module('myApp.map', [
    'myApp.map.show',
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('map', {
                            url: "/map",
                            abstract: true,
                            templateUrl: constants.viewPath() + 'nestedbase.html',
                        });
            }])