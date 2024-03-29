'use strict';

(function () {
    angular.module('myApp.faculty.new', [])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('faculty.new', {
                                url: "/new",
                                controller: "NewFacultyCtrl",
                                templateUrl: '/partials/faculty/new/new.html',
                                data: {
                                    roles: ["SUPER_ADMIN"]
                                }
                            });
                }])
            .controller('NewFacultyCtrl', ["$scope", "$http", "$state", "$timeout", "$rootScope", function ($scope, $http, $state, $timeout, $rootScope) {

                    $scope.faculty = {
                        class: {
                        },
                        department: ""
                    }
                    
                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name);
                        } else {
                            $state.go("home");
                        }
                    };

                    $scope.departmentsLoaded = false;
                    $scope.status = "Retrieving departments...";

                    $http.get(Routing.generate("get_departments"))
                            .then(function (response) {
                                $scope.departments = response.data.departments;
                                $scope.departmentsLoaded = true;
                                $scope.status = "-- choose department --";
                            });

                    var success = function (response) {

                        $scope.setDropzoneUrl(Routing.generate('upload_profpic'));
                        var valid = response.data.valid;
                        if (valid) {
                            if ($scope.hasFile())
                            {
                                var id = response.data.id;
                                $scope.dropzoneEvent("sending", function (file, xhr, data) {
                                    data.append("id", id);
                                });
                                $scope.processDropzone();
                            } else {
                                $('#spinner').fadeOut(100);
                                var n = noty({
                                    text: "Faculty member successfully added",
                                    type: 'success',
                                    layout: 'topRight',
                                    animation: {
                                        open: 'animated tada', // Animate.css class names
                                        close: 'animated bounceOut', // Animate.css class names
                                    },
                                    timeout: 1000
                                });
                                $timeout(function () {
                                    $state.go('home');
                                }, 1000);
                            }
                        } else {
                            var errors = response.data.errors;
                            var fields = response.data.fields;
                            $('.invalid').removeClass('invalid');
                            $.each(fields, function (i, r) {
                                $("label[for='faculty." + r + "']").addClass('invalid');
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
                            text: "Failed to add faculty member",
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

                    };

                    $('form').submit(function (e) {
                        e.preventDefault();

                        var formData = {
                            thesis_bulletinbundle_faculty: $scope.faculty.class,
                            id: $scope.faculty.department
                        };

                        $('#spinner').show();


                        $scope.dropzoneEvent('success', function (file, response) {
                            $('#spinner').fadeOut(100);
                            var n = noty({
                                text: "Faculty member successfully added",
                                type: 'success',
                                layout: 'topRight',
                                animation: {
                                    open: 'animated tada', // Animate.css class names
                                    close: 'animated bounceOut', // Animate.css class names
                                },
                                timeout: 1000
                            });
                            $timeout(function () {
                                $state.go('home');
                            }, 1000);
                        });

                        $http.post(Routing.generate('faculty_create'), $.param(formData), {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        })
                                .then(success, error);

                    });




                }]);



}());


