'use strict';

(function () {
    angular.module('myApp.announcement.edit_plain', [])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('announcement.edit_plain', {
                                url: "/:id/edit/plain",
                                controller: "EditPlainAnnouncementCtrl",
                                templateUrl: '/partials/announcement/edit/edit_plain.html',
                                data: {
                                    roles: ["ADMIN"]
                                }
                            });
                }])

            .controller('EditPlainAnnouncementCtrl', ["$scope", "$http", "$state", "$timeout", "$stateParams", "$rootScope", function ($scope, $http, $state, $timeout, $stateParams, $rootScope) {

                    $scope.priority = {
                        High: 1,
                        Normal: 2,
                        Low: 3,
                    };

                    $('#spinner').show();

                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name);
                        } else {
                            $state.go("home");
                        }
                    };

                    $http.get(Routing.generate("get_announcement", {id: $stateParams.id}))
                            .then(
                                    function (response) {
                                        $('#spinner').fadeOut(500);

                                        var a = response.data.announcement;
                                        $scope.announcement = {
                                            title: a.title,
                                            content: a.content,
                                            htmlContent: a.html_content,
                                            priorityLvl: a.priority_lvl,
                                            pinnedContent: a.pcontent
                                        };
                                        $scope.visible = a.visible;
                                        $scope.pinned = a.pinned;
                                        $scope.visibleMsg = $scope.visible ? "Visible" : "Hidden";
                                        $scope.togglePinnedVisibility();
                                    }
                            );

                    $scope.changeMsg = function () {
                        $scope.visibleMsg = $scope.visible ? "Visible" : "Hidden";
                    };

                    $scope.togglePinnedVisibility = function () {
                        if ($scope.pinned) {
                            $("#pinnedContent").fadeIn(500);
                        } else {
                            $("#pinnedContent").fadeOut(500);
                        }
                    };

                    var success = function (response) {
                        $('#spinner').fadeOut(100);
                        var valid = response.data.valid;
                        if (valid) {
                            $timeout(function () {
                                $state.go('announcement.browse');
                            }, 1000);
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

                    $scope.submit = function () {
                        $scope.announcement.content = tinymce.activeEditor.getContent({format: 'text'});

                        if ($scope.pinned && $scope.announcement.pinnedContent == "") {
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
                                thesis_bulletinbundle_plainannouncement: $scope.announcement,
                                id: $stateParams.id,
                                visible: $scope.visible,
                                pinned: $scope.pinned
                            };
                            $('#spinner').show();

                            $http.post(Routing.generate('announcement_plain_edit'), $.param(formData), {
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            })
                                    .then(success, error);
                        }


                    };


                }]);



}());


