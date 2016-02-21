angular.module('myApp.announcement', [
    'myApp.announcement.show',
    'myApp.announcement.search',
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('announcement', {
                            url: "/announcement",
                            abstract: true,
                            templateUrl: constants.viewPath() + 'nestedbase.html',
                        });
            }])