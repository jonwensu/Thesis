'use strict';

(function () {
    angular.module('myApp.announcement.show', [
        'myApp.filter.trustHtml',
    ])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('announcement.show', {
                                url: "/show/:id",
                                controller: "ShowAnnouncementCtrl",
                                templateUrl: constants.viewPath() + 'announcement/show/show_pub.html',
                            });
                }])
            .controller('ShowAnnouncementCtrl', ["$scope", "$http", "$state", "$stateParams", "Idle", 'timeAgo', "$timeout", "$rootScope", function ($scope, $http, $state, $stateParams, Idle, timeAgo, $timeout, $rootScope) {
                    $('#spinner').show();
                    $scope.webPath = constants.webPath();
                    var oneDay = 60 * 60 * 24;
                    timeAgo.settings.fullDateAfterSeconds = oneDay;

                    $scope.$on("IdleTimeout", function () {
                        $state.go("board.show");
                    });

                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name);
                        } else {
                            $state.go("board.show");
                        }
                    };

                    $http.get(Routing.generate("get_announcement", {id: $stateParams.id}))
                            .then(
                                    function (response) {
                                        $scope.announcement = response.data.announcement;
                                        $('#spinner').fadeOut(500);

                                        if (!$scope.announcement.visible) {
                                            $state.go("board.show");
                                        } else {
                                            if ($scope.announcement.type == 'image') {
                                                $("img.scale").imageScale({
                                                    parent: $('#image-container'),
                                                    rescaleOnResize: true
                                                });
                                            }
                                        }
                                    },
                                    function (reason) {
                                        $state.go("board.show");
                                        $('#spinner').fadeOut(500);
                                    }
                            );

                }]);



}());


