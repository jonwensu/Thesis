angular.module('myApp.department', [
    'myApp.department.new',
    'myApp.department.browse',
    'myApp.department.edit',
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('department', {
                            url: "/department",
                            abstract: true,
                            parent: 'index',
                            templateUrl: '/partials/nestedbase.html',
                        });
            }])