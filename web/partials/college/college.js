angular.module('myApp.college', [
    'myApp.college.new',
    'myApp.college.browse',
    'myApp.college.edit',
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('college', {
                            url: "/college",
                            abstract: true,
                            parent: 'index',
                            templateUrl: constants.viewPath() + 'nestedbase.html',
                        });
            }])