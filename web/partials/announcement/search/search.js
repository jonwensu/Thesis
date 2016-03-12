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
                    $scope.rawQuery = "";
                    $scope.searchMode = "keyword";
                    var oneDay = 60 * 60 * 24;
                    timeAgo.settings.fullDateAfterSeconds = oneDay;
                    $scope.$watch('rawQuery', function () {
                        if ($scope.rawQuery != "" && $scope.searchMode == 'date') {
                            if ($scope.rawQuery == null) {
                                $scope.query = "";
                            } else {
                                var d = $scope.rawQuery;
                                $scope.query = moment(d).format("MMMM D, YYYY");
                            }
                        }
                    });
                    $('.search').click(function () {
                        if ($scope.searchMode == "date") {
                            $scope.searchDate.opened = true;
                        }
                    });
                    
                    $scope.$watch('searchMode', function (data) {
                        $scope.rawDate = "";
                        $scope.query = "";

                        if (data == "date") {
                            $('.search').attr("readonly", "readonly");
                            $('.search').attr("placeholder", "Enter date...");
                            $scope.searchDate.opened = true;

                        } else {
                            $('.search').removeAttr("readonly");
                            $('.search').attr("placeholder", "Enter keyword...");
                            $('.search').css('background', 'white');
                        }
                    })

                    $scope.searchKeyword = function () {
                        $state.go("announcement.search");
                    };


                    $scope.$on("IdleTimeout", function () {
                        $state.go("board.show");
                        $('input.search').getkeyboard().close();
                    });

                    $scope.searchDate = {
                        opened: false
                    };
                    $scope.openCal = function () {
                        $scope.searchDate.opened = true;
                    };

                    $http.get(Routing.generate("get_announcements_search", {id: 1}))
                            .then(
                                    function (response) {
                                        $scope.announcements = response.data.announcements;
                                        $('#spinner').fadeOut(500);
                                        console.log($scope.announcements);
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


