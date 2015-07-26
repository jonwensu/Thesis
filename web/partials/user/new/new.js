'use strict';

(function () {
    angular.module('myApp.user.new', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('user.new', {
                                url: "/new",
                                controller: "NewUserCtrl",
                                templateUrl: constants.viewPath() + 'user/new/new.html'
                            });
                }])

            .controller('NewUserCtrl', ["$scope", "$http", "$state", function ($scope, $http, $state) {

                    var success = function (response) {
                        $('#spinner').fadeOut(100);
                        var valid = response.data.valid;
                        if (valid) {
                            $state.go('home');
                        } else {
                            var errors = response.data.errors;
                            var fields = response.data.fields;
                            var a = "";
                            console.log(errors[0]);
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

                    $scope.tinyConfig = {
                        selector: "textarea",
                        format: 'text',
                        resize: false,
                        inline: false,
                        plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table contextmenu paste jbimages"
                        ],
                        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image jbimages",
                        relative_urls: false
                    };

                    $scope.submit = function () {
                        var formData = {
                            fos_user_registration_form: $scope.user,
//                            confirmPass: $scope.confirmPassword
                        };
                        console.log(formData);
                        $('#spinner').show();

                        $http.post(Routing.generate('fos_user_registration_register'), $.param(formData), {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        })
                                .then(success, error);
                    };
                }]);



}());


