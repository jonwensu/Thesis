angular.module('myApp.announcement', [
    'myApp.announcement.new',
//    'myApp.announcement.browse'
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('announcement', {
                            url: "/announcement",
                            abstract: true,
                            parent: 'index',
                            templateUrl: constants.viewPath() + 'nestedbase.html',
                        });
            }])