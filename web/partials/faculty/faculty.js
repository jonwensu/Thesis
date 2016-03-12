angular.module('myApp.faculty', [
    'myApp.faculty.new',
    'myApp.faculty.browse',
    'myApp.faculty.show',
    'myApp.faculty.edit',
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('faculty', {
                            url: "/faculty",
                            abstract: true,
                            parent: 'index',
                            templateUrl: constants.viewPath() + 'nestedbase.html',
                        });
            }])