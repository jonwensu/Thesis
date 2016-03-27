'use strict';

(function () {
    angular.module('myApp.faculty.show', [])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('faculty.show', {
                                url: "/show/:id",
                                controller: "ShowFacultyCtrl",
                                templateUrl: '/partials/faculty/show/show.html',
                            });
                }])
            .controller('ShowFacultyCtrl', ["$scope", "$http", "$state", "$stateParams", "$rootScope", function ($scope, $http, $state, $stateParams, $rootScope) {

                    $scope.webPath = window.location.origin + "/";
                    $scope.query = "";
                    $scope.loaded = false;
                    $('#spinner').show();

                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name);
                        } else {
                            $state.go("board.show");
                        }
                    };

                    $scope.$on("IdleStart", function () {
                        $state.go("board.show");
                    });

                    $http.get(Routing.generate('get_faculty', {id: $stateParams.id}))
                            .then(
                                    function (response) {
                                        $('#spinner').fadeOut(500);
                                        $scope.loaded = true;
                                        $scope.faculty = response.data.faculty;
                                    }
                            );

                }]);



}());


