angular.module('myApp.user', [
    'myApp.user.new'
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('user', {
                            url: "/admin",
                            templateUrl: PATH + 'nestedbase.html'
                        });
            }])