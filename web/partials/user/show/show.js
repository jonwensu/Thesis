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

            .controller('ViewUserCtrl', ["$scope", "$http", "$stateParams", "$rootScope", "$state", function ($scope, $http, $stateParams, $rootScope, $state) {

                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name, $rootScope.previousStateParams);
                        } else {
                            $state.go("home");
                        }
                    };

                    $http.get(Routing.generate('get_user', {id: $stateParams.id}))
                            .then(function (response) {
                                $scope.user = response.data.user;
                            });

                    $scope.change = function () {
                        $('#changePassModal').modal('show');
                    }


                    $scope.changePass = function () {
                        if ($scope.newPassword == "" || $scope.confirmPassword == "") {
                            var n = noty({
                                text: "Please fill in all fields",
                                type: 'error',
                                layout: 'topRight',
                                animation: {
                                    open: 'animated bounceIn', // Animate.css class names
                                    close: 'animated bounceOut', // Animate.css class names
                                },
                                timeout: 5000
                            });
                        } else {
                            if ($scope.newPassword != $scope.confirmPassword) {
                                var n = noty({
                                    text: "Passwords don't match",
                                    type: 'error',
                                    layout: 'topRight',
                                    animation: {
                                        open: 'animated bounceIn', // Animate.css class names
                                        close: 'animated bounceOut', // Animate.css class names
                                    },
                                    timeout: 5000
                                });
                            } else {
                                $http.post(Routing.generate('user_changepass'), {id: $scope.id, pass: $scope.newPassword, conPass: $scope.confirmPassword})
                                        .then(
                                                function (response) {
                                                    var changed = response.data.changed;
                                                    if (changed) {
                                                        var n = noty({
                                                            text: "Password successfully changed",
                                                            type: 'success',
                                                            layout: 'topRight',
                                                            animation: {
                                                                open: 'animated bounceIn', // Animate.css class names
                                                                close: 'animated bounceOut', // Animate.css class names
                                                            },
                                                            timeout: 5000
                                                        });
                                                    } else {
                                                        var n = noty({
                                                            text: "Change password failed",
                                                            type: 'error',
                                                            layout: 'topRight',
                                                            animation: {
                                                                open: 'animated bounceIn', // Animate.css class names
                                                                close: 'animated bounceOut', // Animate.css class names
                                                            },
                                                            timeout: 5000
                                                        });
                                                    }
                                                }
                                        );
                            }
                        }
                    }

                }]);



}());


