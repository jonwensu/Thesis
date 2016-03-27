angular.module('myApp.faculty', [
    'myApp.faculty.search',
    'myApp.faculty.show'
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('faculty', {
                            url: "/faculty",
                            abstract: true,
                            templateUrl: '/partials/nestedbase.html',
                        });
            }])