angular.module('myApp.announcement', [
    'myApp.announcement.new_plain',
    'myApp.announcement.new_img',
    'myApp.announcement.edit_plain',
    'myApp.announcement.edit_img',
    'myApp.announcement.choose',
    'myApp.announcement.show',
    'myApp.announcement.browse'
])
        .config(['$stateProvider', function ($stateProvider) {
                $stateProvider
                        .state('announcement', {
                            url: "/announcement",
                            abstract: true,
                            parent: 'index',
                            templateUrl: constants.viewPath() + 'nestedbase.html',
                        });
            }])