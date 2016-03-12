'use strict';

(function () {
    angular.module('myApp.faculty.search', [])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('faculty.search', {
                                url: "/search",
                                controller: "SearchFacultyCtrl",
                                templateUrl: constants.viewPath() + 'faculty/search/search.html',
                            });
                }])
            .controller('SearchFacultyCtrl', ["$scope", "$http", "$state", function ($scope, $http, $state) {

                    $scope.webPath = constants.webPath();
                    $scope.query = "";
                    $('#spinner').show();
                    $scope.$on("IdleStart", function () {
                        $state.go("board.show");
                    });
                    $http.get(Routing.generate('get_faculty_all_members'))
                            .then(
                                    function (response) {
                                        $('#spinner').fadeOut(500);
                                        $scope.faculty = response.data.faculty;
                                    }
                            );

                }]);



}());


