'use strict';

(function () {
    angular.module('myApp.announcement.new', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('announcement.new', {
                                url: "/new",
                                controller: "NewAnnouncementCtrl",
                                templateUrl: constants.viewPath() + 'announcement/new/new.html',
                                data: {
                                    roles: ["ADMIN"]
                                }
                            });
                }])

            .controller('NewAnnouncementCtrl', ["$scope", "$http", "$state", function ($scope, $http, $state) {

                    $scope.priority = {
                        High : 1,
                        Normal : 2,
                        Low : 3,
                    };

                    $scope.announcement = {
                        title: "",
                        content: "",
                        priorityLvl: 2
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
                                $("label[for='announcement." + r + "']").addClass('invalid');
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
                            thesis_bulletinbundle_announcement: $scope.announcement,
                            html_format: tinymce.activeEditor.getContent({format: 'html'})
                        };
                        $('#spinner').show();

                        $http.post(Routing.generate('announcement_create'), $.param(formData), {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        })
                                .then(success, error);
                    };


                }]);



}());


