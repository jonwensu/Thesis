'use strict';

(function () {
    angular.module('myApp.department.new', [])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('department.new', {
                                url: "/new",
                                controller: "NewDepartmentCtrl",
                                templateUrl: constants.viewPath() + 'department/new/new.html',
                                data: {
                                    roles: ["SUPER_ADMIN"]
                                }
                            });
                }])
            .controller('NewDepartmentCtrl', ["$scope", "$http", "$state", "$rootScope", function ($scope, $http, $state, $rootScope) {

                    $scope.department = {
                        class: {
                            name: "",
                        },
                        college: ""
                    }

                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name);
                        } else {
                            $state.go("home");
                        }
                    };

                    $http.get(Routing.generate("get_colleges"))
                            .then(function (response) {
                                $scope.colleges = response.data.colleges;
                            });

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
                                $("label[for='department." + r + "']").addClass('invalid');
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
                            text: "Failed to create department",
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
                            thesis_bulletinbundle_department: $scope.department.class,
                            id: $scope.department.college
                        };

                        $('#spinner').show();
                        $http.post(Routing.generate('department_create'), $.param(formData), {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        })
                                .then(success, error);
                    };


                }]);



}());


