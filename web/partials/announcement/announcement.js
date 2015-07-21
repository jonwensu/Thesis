angular.module('myApp.announcement', [
    'myApp.announcement.new'
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('announcement', {
                            url: "/announcement",
                            templateUrl: PATH + 'nestedbase.html'
                        });
            }])