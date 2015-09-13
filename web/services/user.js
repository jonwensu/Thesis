'use strict';

(function () {
    angular.module('myApp.service.user', [])
            .service('userService', ['$http', function ($http) {
                    this.getUsers = function (success, error) {
                        $http.get(Routing.generate('get_users_other'))
                                .then(success, error);
                    };

                    this.postUser = function ($scope, $state) {

                        var formData = {
                            fos_user_registration_form: $scope.user,
                        };

                        var success = function (response) {
                            $('#spinner').fadeOut(100);
                            var valid = response.data.valid;
                            if (valid) {
                                $state.go('home');
                            } else {
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
                            }
                        };

                        var error = function (reason) {
                            $('#spinner').fadeOut(100);
                            var n = noty({
                                text: "Failed to create announcement",
                                type: 'error',
                                layout: 'topRight',
                                animation: {
                                    open: 'animated tada', // Animate.css class names
                                    close: 'animated bounceOut', // Animate.css class names
                                },
                                timeout: 10000
                            });
                        };

                        $('#spinner').show();
                        $http.post(Routing.generate('fos_user_registration_register'), $.param(formData), {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        })
                                .then(success, error);
                    };
                }]);
}());
        