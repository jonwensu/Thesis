angular.module('myApp.announcement', [
    'myApp.announcement.new'
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('announcement', {
                            url: "/announcement",
                            abstract: true,
                            templateUrl: constants.viewPath() + 'nestedbase.html',
                            data: {
                                roles: ["ADMIN"]
                            }
                        });
            }])