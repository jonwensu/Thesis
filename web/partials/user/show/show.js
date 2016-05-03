'use strict';

(function () {
    angular.module('myApp.user.show', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('user.show', {
                                url: "/view/:id",
                                controller: "ViewUserCtrl",
                                templateUrl: '/partials/user/show/show.html',
                                data: {
                                    roles: ["SUPER_ADMIN", "OWNER"]
                                }
                            });
                }])

            .controller('ViewUserCtrl', ["$scope", "$http", "$stateParams", "$rootScope", "$state", "principal", function ($scope, $http, $stateParams, $rootScope, $state, principal) {

                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name, $rootScope.previousStateParams);
                        } else {
                            $state.go("home");
                        }
                    };

                    $scope.isOwner = function () {
                        return principal.isInRole("ROLE_OWNER");
                    };

                    $scope.isAdmin = function () {
                        return principal.isInRole("ROLE_SUPER_ADMIN");
                    };
                    
                    $scope.id = $stateParams.id;
                    $http.get(Routing.generate('get_user', {id: $scope.id}))
                            .then(function (response) {
                                $scope.user = response.data.user;
                            });

                    $scope.change = function () {
                        $('#changePassModal').modal('show');
                    }

                    $('#changePass').click(function () {
                        $('#changePassModal').modal('show');
                    });

                    function clearPassFields() {
                        $scope.oldPassword = "";
                        $scope.newPassword = "";
                        $scope.confirmPassword = "";
                    }


                    $scope.changePass = function () {
                        if (($scope.newPassword == "" || $scope.confirmPassword == "" || $scope.oldPassword == "") && $scope.isOwner()
                                || ($scope.newPassword == "" || $scope.confirmPassword == "") && $scope.isAdmin()) {
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
                                $scope.oldPassword = $scope.isOwner() ? $scope.oldPassword : "password";
                                $http.post(Routing.generate('user_changepass'), {id: $scope.id, pass: $scope.newPassword, conPass: $scope.confirmPassword, oldPass: $scope.oldPassword})
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
                                                        var message = response.data.message;
                                                        var n = noty({
                                                            text: message,
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
                        clearPassFields();
                        $('#changePassModal').modal('hide');
                    }

                }]);



}());


