'use strict';

(function () {
    angular.module('myApp.announcement.search', [
    ])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('announcement.search', {
                                url: "/search",
                                controller: "SearchAnnouncementCtrl",
                                templateUrl: constants.viewPath() + 'announcement/search/search.html',
                            });
                }])
            .controller('SearchAnnouncementCtrl', ["$scope", "$http", "$state", "$stateParams", "Idle", 'timeAgo', "$timeout", function ($scope, $http, $state, $stateParams, Idle, timeAgo, $timeout) {
                    $('#spinner').show();
                    $scope.webPath = constants.webPath();
                    $scope.query = "";
                    $scope.$on("IdleTimeout", function () {
                        $state.go("board.show");
                        $('input.search').getkeyboard().close();
                    });

                    $http.get(Routing.generate("get_announcements_search", {id: 1}))
                            .then(
                                    function (response) {
                                        $scope.announcements = response.data.announcements;
                                        $('#spinner').fadeOut(500);
                                    },
                                    function (reason) {
                                        $state.go("board.show");
                                        $('#spinner').fadeOut(500);
                                    }
                            );


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

                }]);



}());


