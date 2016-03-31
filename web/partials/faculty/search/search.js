'use strict';

(function () {
    angular.module('myApp.faculty.search', [])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('faculty.search', {
                                url: "/search",
                                controller: "SearchFacultyCtrl",
                                templateUrl: '/partials/faculty/search/search.html',
                            });
                }])
            .controller('SearchFacultyCtrl', ["$scope", "$http", "$state", function ($scope, $http, $state) {

                    $scope.webPath = window.location.origin + "/";
                    $scope.query = "";
                    $('#spinner').show();
                    $scope.$on("IdleStart", function () {
                        $state.go("board.show");
                    });

                    $('input.search').keyboard({
                        layout: 'custom',
                        customLayout: {
                            'default': [
                                '1 2 3 4 5 6 7 8 9 0 {b}',
                                'Q W E R T Y U I O P',
                                'A S D F G H J K L',
                                '{s} Z X C V B N M {clear}',
                                '{space} {a}'
                            ],
                            'shift': [
                                '1 2 3 4 5 6 7 8 9 0 {b}',
                                '! @ # $ % & * ( ) - + = ^',
                                '{s} , . ? _ / \\ \' Ñ {clear}',
                                '{space} {a}'
                            ]
                        },
                        visible: function (event, keyboard, el) {
                            $('.search-link').click(function () {
                                $('input.search').getkeyboard().close();
                            });

                        },
                        display: {
                            's': ' ',
                            'clear': ' ',
                            'b': ' ',
                            'a': ' '
                        },
                        usePreview: false,
                        autoAccept: true
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


