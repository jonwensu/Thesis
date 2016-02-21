angular.module('myApp.board', [
    'myApp.board.show',
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('board', {
                            url: "/board",
                            abstract: true,
                            templateUrl: constants.viewPath() + 'nestedbase.html',
                        });
            }])