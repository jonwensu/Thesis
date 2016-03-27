'use strict';

(function () {
    angular.module('myApp.announcement.edit_img', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('announcement.edit_img', {
                                url: "/:id/edit/image",
                                controller: "EditImageAnnouncementCtrl",
                                templateUrl: '/partials/announcement/edit/edit_img.html',
                                data: {
                                    roles: ["ADMIN"]
                                }
                            });
                }])

            .controller('EditImageAnnouncementCtrl', ["$scope", "$http", "$state", "$timeout", "$stateParams", "$rootScope", function ($scope, $http, $state, $timeout, $stateParams, $rootScope) {

                    $scope.priority = {
                        High: 1,
                        Normal: 2,
                        Low: 3,
                    };

                    $('#spinner').show();
                    $scope.loading = true;


                    var currFileRemoved = false;
                    var currImg = null;
                    $http.get(Routing.generate("get_announcement", {id: $stateParams.id}))
                            .then(
                                    function (response) {
                                        $('#spinner').fadeOut(500);
                                        $scope.loading = false;
                                        var a = response.data.announcement;
                                        $scope.announcement = {
                                            title: a.title,
                                            description: a.description,
                                            priorityLvl: a.priority_lvl,
                                        };

                                        currImg = a.document;
                                        $scope.loadImage(currImg);
                                        $scope.visible = a.visible;
                                        $scope.visibleMsg = $scope.visible ? "Visible" : "Hidden";
                                        $scope.dropzoneEvent('addedfile', function (file) {
                                            if (!currFileRemoved) {
                                                $scope.getDropzone().removeFile($scope.currFile);
                                                $scope.getDropzone().options.maxFiles = 1;
                                                currFileRemoved = true;
                                            }
                                        });
                                    }
                            );

                    $scope.resetImage = function () {
                        if (currFileRemoved) {
                            $scope.getDropzone().removeAllFiles();
                            $scope.loadImage(currImg);
                            currFileRemoved = false;
                        }
                    }
                    $scope.visibleMsg = $scope.visible ? "Visible" : "Hidden";
                    $scope.changeMsg = function () {
                        $scope.visibleMsg = $scope.visible ? "Visible" : "Hidden";
                    };

                    var success = function (response) {

                        var valid = response.data.valid;

                        if (valid) {

                            if (currFileRemoved) {
                                var id = response.data.id;
                                $scope.dropzoneEvent("sending", function (file, xhr, data) {
                                    data.append("id", id);
                                });
                                $scope.processDropzone();
                            } else {
                                $('#spinner').fadeOut(100);
                                var n = noty({
                                    text: "Announcement successfully updated",
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
                        plugins: [
                            "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
                            "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                            "table contextmenu directionality emoticons template textcolor paste textcolor colorpicker textpattern imagetools jbimages"
                        ],
                        toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
                        toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink jbimages | insertdatetime preview | forecolor backcolor",
                        toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | ltr rtl | spellchecker | fullscreen  imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io']",
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

                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name);
                        } else {
                            $state.go("home");
                        }
                    };

                    $('form').submit(function (e) {
                        e.preventDefault();

                        if (!$scope.hasFile() && currFileRemoved) {
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
                                thesis_bulletinbundle_imageannouncement: $scope.announcement,
                                visible: $scope.visible,
                                changed: currFileRemoved,
                                id: $stateParams.id,
                                docId: currImg.id
                            };
                            console.log(formData);
                            $('#spinner').show();
                            $http.post(Routing.generate('announcement_image_edit'), $.param(formData), {
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            })
                                    .then(success, error);

                            $scope.dropzoneEvent('success', function (file, response) {
                                $('#spinner').fadeOut(100);
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
                                }, 1500);
                            });
                        }
                    });


                }]);



}());


