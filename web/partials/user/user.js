angular.module('myApp.user', [
    'myApp.user.new',
    'myApp.user.browse',
    'myApp.user.show'
])
        .config(['$stateProvider',  function ($stateProvider) {
                $stateProvider
                        .state('user', {
                            url: "/admin",
                            templateUrl: constants.viewPath() + 'nestedbase.html'
                        });
            }])