angular.module('myApp.index', [])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('index', {
                            abstract: true,
                            templateUrl: constants.viewPath() + 'nestedbase.html',
                            resolve: {
                                authorize: ['authorization',
                                    function (authorization) {
                                        return authorization.authorize();
                                    }
                                ]
                            }
                        });
            }])