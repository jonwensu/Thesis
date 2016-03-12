'use strict';

(function () {
    angular.module('myApp.department.edit', [])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('department.edit', {
                                url: "/:id/edit",
                                controller: "EditDepartmentCtrl",
                                templateUrl: constants.viewPath() + 'department/edit/edit.html',
                                data: {
                                    roles: ["SUPER_ADMIN"]
                                }
                            });
                }])
            .controller('EditDepartmentCtrl', ["$scope", "$http", "$state", "$stateParams", "$rootScope", function ($scope, $http, $state, $stateParams, $rootScope) {

                    $scope.department = {
                        class: {
                            name: "Retrieving department...",
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

                    $('#spinner').show();

                    $scope.id = $stateParams.id;
                    $scope.ready = false;

                    $http.get(Routing.generate('get_department', {id: $scope.id}))
                            .then(function (response) {
                                var temp = response.data.department;
                                $http.get(Routing.generate("get_colleges"))
                                        .then(function (response) {
                                            $scope.colleges = response.data.colleges;
                                            $scope.ready = true;
                                            $scope.department = {
                                                class: {
                                                    name: temp.name
                                                },
                                                college: temp.college.id
                                            };
                                            $('#spinner').fadeOut(500);
                                        });
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
                            college_id: $scope.department.college,
                            id: $scope.id
                        };

                        $('#spinner').show();
                        $http.post(Routing.generate('department_update'), $.param(formData), {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        })
                                .then(success, error);
                    };


                }]);



}());


