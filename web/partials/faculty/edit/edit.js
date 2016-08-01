'use strict';

(function () {
    angular.module('myApp.faculty.edit', [])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('faculty.edit', {
                                url: "/:id/edit",
                                controller: "EditFacultyCtrl",
                                templateUrl: '/partials/faculty/edit/edit.html',
                                data: {
                                    roles: ["SUPER_ADMIN"]
                                }
                            });
                }])
            .controller('EditFacultyCtrl', ["$scope", "$http", "$state", "$stateParams", "$timeout", "$rootScope", function ($scope, $http, $state, $stateParams, $timeout, $rootScope) {


                    $scope.id = $stateParams.id;
                    $('#spinner').show();

                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name);
                        } else {
                            $state.go("home");
                        }
                    };

                    $scope.departmentsLoaded = false;
                    $scope.status = "Retrieving departments...";
                    $scope.currFileRemoved = false;
                    $scope.currImg = null;


                    $http.get(Routing.generate('get_faculty', {id: $scope.id}))
                            .then(function (response) {
                                var temp = response.data.faculty;

                                $scope.noProfPic = temp.picture != null;
                                if (temp.picture != null) {
                                    $scope.currImg = temp.picture;
                                    $scope.loadImage($scope.currImg);
                                    $scope.dropzoneEvent('addedfile', function (file) {
                                        $scope.resetImage();
                                        if (!$scope.currFileRemoved) {
                                            $scope.currFileRemoved = true;
                                            $scope.getDropzone().removeFile($scope.currFile);
                                            $scope.getDropzone().options.maxFiles = 1;
                                        }
                                    });
                                }
                                $http.get(Routing.generate("get_departments"))
                                        .then(function (response) {
                                            $scope.departments = response.data.departments;
                                            $scope.departmentsLoaded = true;
                                            $scope.status = "-- choose department --";
                                            $scope.faculty = {
                                                class: {
                                                    firstName: temp.first_name,
                                                    lastName: temp.last_name,
                                                    office: temp.office,
                                                    email: temp.email
                                                },
                                                department: temp.department.id
                                            };

                                            $('#spinner').fadeOut(500);
                                        });

                            })
                            ;

                    $scope.resetImage = function () {
                        if ($scope.currFileRemoved) {
                            $scope.getDropzone().removeAllFiles();
                            $scope.loadImage($scope.currImg);
                            $scope.currFileRemoved = false;
                        }
                    }

                    var success = function (response) {

                        $scope.setDropzoneUrl(Routing.generate('upload_profpic'));
                        var valid = response.data.valid;
                        if (valid) {
                            if ($scope.currFileRemoved || $scope.noProfPic && $scope.currImg != null)
                            {
                                var id = response.data.id;
                                $scope.dropzoneEvent("sending", function (file, xhr, data) {
                                    data.append("id", id);
                                });
                                $scope.processDropzone();
                            } else {
                                $('#spinner').fadeOut(100);
                                var n = noty({
                                    text: "Faculty member info successfully updated",
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
                                }, 1500);
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



                    $('form').submit(function (e) {
                        e.preventDefault();
                        if (!$scope.hasFile() && $scope.currFileRemoved) {
                            var n = noty({
                                text: "Please upload an image",
                                type: 'error',
                                layout: 'topRight',
                                animation: {
                                    open: 'animated tada', // Animate.css class names
                                    close: 'animated bounceOut', // Animate.css class names
                                },
                                timeout: 10000
                            });
                        } else {
                            var formData = {
                                thesis_bulletinbundle_faculty: $scope.faculty.class,
                                id: $scope.id,
                                dep_id: $scope.faculty.department
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

                            $http.post(Routing.generate('faculty_update'), $.param(formData), {
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            })
                                    .then(success, error);
                        }

                    });




                }]);



}());


