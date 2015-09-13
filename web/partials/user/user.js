angular.module('myApp.user', [
    'myApp.user.new',
    'myApp.user.browse',
    'myApp.user.show',
    'myApp.user.edit'
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('user', {
                            url: "/admin",
                            abstract: true,
                            templateUrl: constants.viewPath() + 'nestedbase.html',
                             data: {
                                    roles: ["ADMIN"]
                                }
                        });
            }])