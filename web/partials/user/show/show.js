'use strict';

(function () {
    angular.module('myApp.user.show', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('user.show', {
                                url: "/view/:id",
                                controller: "ViewUserCtrl",
                                templateUrl: constants.viewPath() + 'user/show/show.html',
                                data: {
                                    roles: ["SUPER_ADMIN"]
                                }
                            });
                }])

            .controller('ViewUserCtrl', ["$scope", "$http", "$stateParams", function ($scope, $http, $stateParams) {

                    $http.get(Routing.generate('get_user', {id: $stateParams.id}))
                            .then(function (response) {
                                $scope.user = response.data.user;
                            });

                }]);



}());


