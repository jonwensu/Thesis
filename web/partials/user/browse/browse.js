'use strict';

(function () {
    angular.module('myApp.user.browse', ['ui.grid'])
            .config(['$stateProvider', function ($stateProvider) {
                    $stateProvider
                            .state('user.browse', {
                                url: "/all",
                                controller: "BrowseUserCtrl",
                                templateUrl: constants.viewPath() + 'user/browse/browse.html'
                            });
                }])

            .controller('BrowseUserCtrl', ["$scope", "$http", "$state", "uiGridConstants", function ($scope, $http, $state, uiGridConstants) {

                    var success = function (response) {
                        $scope.users = response.data.users;
                    };
                    var error = function (reason) {
                        $scope.error = "Failed to fetch admins";
                    };
                    $http.get(Routing.generate('get_users'))
                            .then(success, error);
                    $scope.gridOptions = {
                        data: 'users',
                        onRegisterApi: function (gridApi) {
                            $scope.gridApi = gridApi;
                        },
                        enableCellSelection: true,
                        enableFiltering: false,
                        enableHorizontalScrollbar: 0,
                        columnDefs: [
                            {field: "username"},
                            {field: "email"},
                            {field: "enabled", enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents"><span ng-if="row.entity.enabled == true">Yes</span><span ng-if="row.entity.enabled == false">No</span></div>'},
                            {name: "Action", cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref="user.show({id: row.entity.id})">Show</a></div>'},
                        ]
                    };

                    $scope.toggleFiltering = function () {
                        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                        $scope.filterStat = $scope.gridOptions.enableFiltering ? "On" : "Off";
                    };
                    $scope.filterStat = $scope.gridOptions.enableFiltering ? "On" : "Off";
                    
                    
                }]);



}());




