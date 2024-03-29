'use strict';

(function () {
    angular.module('myApp.announcement.new_img', [
        'myApp.directive.dropzone'
    ])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('announcement.new_img', {
                                url: "/new/img",
                                controller: "NewImgAnnouncementCtrl",
                                templateUrl: '/partials/announcement/new/new_img.html',
                                data: {
                                    roles: ["ADMIN"]
                                }
                            });
                }])

            .controller('NewImgAnnouncementCtrl', ["$scope", "$http", "$state", "$timeout", function ($scope, $http, $state, $timeout) {

                    $scope.priority = {
                        High: 1,
                        Normal: 2,
                        Low: 3,
                    };

                    $scope.announcement = {
                        title: "",
                        description: "",
                        priorityLvl: 2,
                        pinnedContent: "",
                    };


                    $scope.togglePinnedVisibility = function () {
                        if ($scope.pinned) {
                            $("#pinnedContent").fadeIn(500);
                        } else {
                            $("#pinnedContent").fadeOut(500);
                        }
                    };

                    $scope.visible = true;
                    $scope.visibleMsg = $scope.visible ? "Visible" : "Hidden";
                    $scope.pinned = false;
                    $scope.togglePinnedVisibility();
                    $scope.changeMsg = function () {
                        $scope.visibleMsg = $scope.visible ? "Visible" : "Hidden";
                    };


                    $scope.tinyConfig = {
                        selector: "textarea",
                        plugins: [
                            "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
                            "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                            "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
                        ],
                        toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
                        toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink | insertdatetime preview | forecolor backcolor",
                        toolbar3: "hr removeformat | subscript superscript | charmap emoticons | ltr rtl | spellchecker | fullscreen ",
                        menubar: false,
                        toolbar_items_size: 'small',
                        relative_urls: false,
                        style_formats: [{
                                title: 'Bold text',
                                inline: 'b'
                            }, {
                                title: 'Red text',
                                inline: 'span',
                                styles: {
                                    color: '#ff0000'
                                }
                            }, {
                                title: 'Red header',
                                block: 'h1',
                                styles: {
                                    color: '#ff0000'
                                }
                            }, {
                                title: 'Example 1',
                                inline: 'span',
                                classes: 'example1'
                            }, {
                                title: 'Example 2',
                                inline: 'span',
                                classes: 'example2'
                            }, {
                                title: 'Table styles'
                            }, {
                                title: 'Table row 1',
                                selector: 'tr',
                                classes: 'tablerow1'
                            }],
                        templates: [{
                                title: 'Test template 1',
                                content: 'Test 1'
                            }, {
                                title: 'Test template 2',
                                content: 'Test 2'
                            }],
                    };

                    var success = function (response) {
                        $('#spinner').fadeOut(100);
                        var valid = response.data.valid;

                        if (valid) {
                            var id = response.data.id;
                            $scope.dropzoneEvent("sending", function (file, xhr, data) {
                                data.append("id", id);
                            });

                            $scope.processDropzone();
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



                    $('form').submit(function (e) {
                        e.preventDefault();

                        if (!$scope.hasFile()) {
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
                        } else if ($scope.pinned && $scope.announcement.pinnedContent == "") {
                            var n = noty({
                                text: "You have pinned this announcement. Please enter the content to show in the ticker.",
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
                                thesis_bulletinbundle_imageannouncement: $scope.announcement,
                                visible: $scope.visible,
                                pinned: $scope.pinned
                            };

                            $('#spinner').show();
                            $http.post(Routing.generate('announcement_image_create'), $.param(formData), {
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            })
                                    .then(success, error);

                            $scope.dropzoneEvent('success', function (file, response) {
                                var n = noty({
                                    text: "Announcement successfully uploaded",
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
                        }
                    });


                }]);



}());


