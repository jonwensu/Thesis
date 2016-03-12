'use strict';

(function () {
    angular.module('myApp.college.new', [])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('college.new', {
                                url: "/new",
                                controller: "NewCollegeCtrl",
                                templateUrl: constants.viewPath() + 'college/new/new.html',
                                data: {
                                    roles: ["SUPER_ADMIN"]
                                }
                            });
                }])
            .controller('NewCollegeCtrl', ["$scope", "$http", "$state", "$rootScope", function ($scope, $http, $state, $rootScope) {

                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name);
                        } else {
                            $state.go("home");
                        }
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
                                $("label[for='college." + r + "']").addClass('invalid');
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
                            text: "Failed to create college",
                            type: 'error',
                            layout: 'topRight',
                            animation: {
                                open: 'animated tada', // Animate.css class names
                                close: 'animated bounceOut', // Animate.css class names
                            },
                            timeout: 10000
                        });
                    };


                    $scope.submit = function () {
                        var formData = {
                            thesis_bulletinbundle_college: $scope.college,
                        };

                        $('#spinner').show();
                        $http.post(Routing.generate('college_create'), $.param(formData), {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        })
                                .then(success, error);
                    };


                }]);



}());


