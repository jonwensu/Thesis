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
                                    roles: ["SUPER_ADMIN", "OWNER"]
                                }
                            });
                }])

            .controller('ViewUserCtrl', ["$scope", "$http", "$stateParams", "principal", function ($scope, $http, $stateParams, principal) {

                    $http.get(Routing.generate('get_user', {id: $stateParams.id}))
                            .then(function (response) {
                                $scope.user = response.data.user;
                            });
                }]);



}());

