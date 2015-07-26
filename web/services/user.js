'use strict';

(function () {
    angular.module('myApp.service.user', [])
            .service('userService', function () {

                this.get = function () {

                    alert('aw');

                };


            });
}());
        