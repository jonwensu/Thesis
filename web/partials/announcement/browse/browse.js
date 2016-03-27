'use strict';
(function () {
    angular.module('myApp.announcement.browse', [
        'myApp.filter.trustHtml',
    ])
            .config(['$stateProvider', function ($stateProvider) {

                    $stateProvider
                            .state('announcement.browse', {
                                url: "/browse",
                                controller: "BrowseAnnouncementCtrl",
                                templateUrl: '/partials/announcement/browse/browse.html',
                                data: {
                                    roles: ["ADMIN"]
                                }
                            });
                }])
            .filter('priorityFilter', function () {
                var priority = [
                    "High",
                    "Normal",
                    "Low"
                ];
                return function (value) {
                    return priority[value - 1];
                }
            })
            .controller('BrowseAnnouncementCtrl', ["$scope", "$http", "$state", "uiGridConstants", "$interval", "$rootScope", function ($scope, $http, $state, uiGridConstants, $interval, $rootScope) {

                    $('#spinner').show();

                    $scope.priotityIndex = [
                        "High",
                        "Normal",
                        "Low",
                    ];

                    $http.get(Routing.generate("get_announcements_all", {id: 1}))
                            .then(function (response) {
                                $('#spinner').fadeOut(500);
                                $scope.announcements = response.data.announcements;
                            });
                    $scope.visibilityStat = "";
                    $scope.announcementId = "";
                    $scope.showVisibilityModal = function (visible, id) {
                        $('#visibilityModal').modal('show');
                        $scope.visibilityStat = visible ? "hide" : "show";
                        $scope.announcementId = id;
                    }
                    ;

                    $scope.previous = function () {
                        if ($rootScope.previousState.name) {
                            $state.go($rootScope.previousState.name);
                        } else {
                            $state.go("home");
                        }
                    };

                    function  fetchAnnouncements() {
                        $http.get(Routing.generate("get_announcements_all", {id: 1}))
                                .then(function (response) {
                                    $scope.announcements = response.data.announcements;
                                });
                    }
                    ;
                    $interval(fetchAnnouncements, 3000);

                    $scope.toggleVisibility = function () {
                        if ($scope.announcementId == "") {
                            var n = noty({
                                text: "Announcement not specified",
                                type: 'error',
                                layout: 'topRight',
                                animation: {
                                    open: 'animated tada', // Animate.css class names
                                    close: 'animated bounceOut', // Animate.css class names
                                },
                                timeout: 5000
                            });
                        } else {
                            $('#spinner').show();
                            $('#visibilityModal').modal('hide');
                            $http.post(Routing.generate('toggle_visibility'), {id: $scope.announcementId})
                                    .then(
                                            function (response) {
                                                $('#spinner').fadeOut(500);
                                                var n = noty({
                                                    text: "Successfully changed announcement visibility",
                                                    type: 'success',
                                                    layout: 'topRight',
                                                    animation: {
                                                        open: 'animated tada', // Animate.css class names
                                                        close: 'animated bounceOut', // Animate.css class names
                                                    },
                                                    timeout: 5000
                                                });
                                            },
                                            function (reason) {
                                                var n = noty({
                                                    text: "Failed to toggle announcement visibility",
                                                    type: 'error',
                                                    layout: 'topRight',
                                                    animation: {
                                                        open: 'animated tada', // Animate.css class names
                                                        close: 'animated bounceOut', // Animate.css class names
                                                    },
                                                    timeout: 5000
                                                });
                                            });
                        }
                    }

                    $scope.toggleFiltering = function () {
                        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                    };
                    var actionTemplate = '<div class="ui-grid-cell-contents">' +
                            '<a class="label label-primary" uib-tooltip="View" tooltip-placement="left" ui-sref="announcement.show({id: row.entity.id})">' +
                            '<i class="fa fa-eye"></i>' +
                            '</a>&nbsp;' +
                            '<a class="label label-info" ng-if="row.entity.type == \'plain\'" uib-tooltip="Edit" tooltip-placement="left" ui-sref="announcement.edit_plain({id: row.entity.id})">' +
                            '<i class="fa fa-pencil"></i>' +
                            '</a>' +
                            '<a class="label label-info" ng-if="row.entity.type == \'image\'" uib-tooltip="Edit" tooltip-placement="left" ui-sref="announcement.edit_img({id: row.entity.id})">' +
                            '<i class="fa fa-pencil"></i>' +
                            '</a>' +
                            "&nbsp;<a href='' ng-click='grid.appScope.showVisibilityModal(row.entity.visible, row.entity.id)'>" +
                            '<span ng-if="row.entity.visible" uib-tooltip="Hide" tooltip-placement="left" class="label label-warning">' +
                            '<i class="fa fa-times"></i>' +
                            '</span>' +
                            '<span ng-if="!row.entity.visible" uib-tooltip="Show" tooltip-placement="left" class="label label-success">' +
                            '<i class="fa fa-check"></i>' +
                            '</span>' +
                            '</a>&nbsp;' +
                            '<a class="label label-danger" uib-tooltip="Delete" tooltip-placement="left" ng-click="grid.appScope.deleteAnnouncement(row.entity.id)">' +
                            '<i class="fa fa-trash"></i>' +
                            '</a>&nbsp;' +
                            '</div>';


                    $scope.gridOptions = {
                        data: 'announcements',
                        onRegisterApi: function (gridApi) {
                            $scope.gridApi = gridApi;
                        },
                        enableCellSelection: true,
                        enableFiltering: false,
                        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                        enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                        columnDefs: [
                            {field: "title", cellClass: "text-left"},
                            {name: "priority_lvl", displayName: "Priority Level", cellFilter: "priorityFilter"},
                            {field: "type", cellClass: "text-capitalize"},
                            {field: "date_posted",
                                cellFilter: 'date:\'longDate\''},
                            {field: "visible", enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents"><span ng-if="row.entity.visible">Yes</span><span ng-if="!row.entity.visible">No</span></div>'},
                            {field: "encoder.full_name", displayName: "Encoder"},
                            {name: "Action", enableSorting: false, enableFiltering: false, enableHiding: false, cellTemplate: actionTemplate},
                        ]
                    };


                    $scope.deleteAnnouncement = function (id) {
                        $('#deleteModal').modal('show');
                        $scope.announcementId = id;
                    };

                    $('#deleteModal').on('hide.bs.modal', function () {
                        $scope.password = "";
                    });

                    $scope.confirm = function () {
                        $('#spinner').fadeIn(300);
                        $http.post(Routing.generate('announcement_delete'), {password: $scope.password, id: $scope.announcementId})
                                .then(function (response) {
                                    if (response.data.match) {
                                        var n = noty({
                                            text: "Announcement successfully deleted",
                                            type: 'success',
                                            layout: 'topRight',
                                            animation: {
                                                open: 'animated bounceIn', // Animate.css class names
                                                close: 'animated bounceOut', // Animate.css class names
                                            },
                                            timeout: 5000
                                        });
                                    } else {
                                        var n = noty({
                                            text: "Invalid password",
                                            type: 'error',
                                            layout: 'topRight',
                                            animation: {
                                                open: 'animated bounceIn', // Animate.css class names
                                                close: 'animated bounceOut', // Animate.css class names
                                            },
                                            timeout: 5000
                                        });
                                    }

                                    $('#spinner').fadeOut(300);
                                });
                        $('#deleteModal').modal('hide');
                    };

                }]);
}());


