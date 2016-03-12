'use strict';

(function () {
    angular.module('myApp.user.edit', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('user.edit', {
                                url: "/:id/edit",
                                controller: "EditUserCtrl",
                                templateUrl: constants.viewPath() + 'user/edit/edit.html',
                                data: {
                                    roles: ["SUPER_ADMIN", "OWNER"]
                                }
                            });
                }])

            .controller('EditUserCtrl', ["$scope", "$http", "$state", "$stateParams", function ($scope, $http, $state, $stateParams) {
                    $http.get(Routing.generate('get_user', {id: $stateParams.id}))
                            .then(function (response) {
                                var user = response.data.user;
                                $scope.user = user;
                                 $('#spinner').fadeOut(100);
                            });

                    $('#spinner').show();

                    $scope.submit = function () {
                        var user = {
                            email: $scope.user.email,
                            username: $scope.user.username,
                            first_name: $scope.user.first_name,
                            last_name: $scope.user.last_name
                        };

                        var formData = {
                            fos_user_profile_form: user,
                            id: $stateParams.id
                        };

                        var success = function (response) {
                            $('#spinner').fadeOut(100);
                            var valid = response.data.valid;

                            if (valid) {
                                $state.go('user.show', {'id': $stateParams.id});
                            } else {
                                var authorized = response.data.authorized;
                                if (authorized) {
                                    var errors = response.data.errors;
                                    var fields = response.data.fields;
                                    $('.invalid').removeClass('invalid');
                                    $.each(fields, function (i, r) {
                                        $("label[for='user." + r + "']").addClass('invalid');
                                    });
                                    $.each(errors, function (i, v) {
                                        if (v != "") {
                                            var n = noty({
                                                text: v,
                                                type: 'error',
                                                layout: 'topRight',
                                                animation: {
                                                    open: 'animated tada', // Animate.css class names
                                                    close: 'animated bounceOut', // Animate.css class names
                                                },
                                                timeout: 10000
                                            });
                                        }
                                    });
                                } else {
                                    window.location.href = Routing.generate("fos_user_security_login");
                                }
                            }

                        };
                        var error = function (reason) {
                            $('#spinner').fadeOut(100);
                            alert('error');
                        };


                        $('#spinner').show();
                        $http.post(Routing.generate('user_edit'), $.param(formData), {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        })
                                .then(success, error);
                    }
                }]);



}());


