'use strict';

(function () {
    angular.module('myApp.service.authorization', [])
            .service('authorization', ['$http', '$rootScope', '$state', 'principal', function ($http, $rootScope, $state, principal) {


//                    this.authorize = function () {
//                        return principal.identity().then(function () {
//                            var isAuthenticated = principal.isAuthenticated();
//
//                            if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
//                                if (isAuthenticated)
//                                    $state.go("announcement_new");
//                                else {
//                                    $rootScope.returnToState = $rootScope.toState;
//                                    $rootScope.returnToStateParams = $rootScope.toStateParams;
//                                    window.location.href = Routing.generate("fos_user_security_login");
//                                }
//                            }
//                        });
//                    };

                    this.isAuthorized = function () {
                        var required = $rootScope.toState.data.roles;
                        var state = $rootScope.toState.name;
                        var exemptions = ["user.edit", "user.show"];
                        var id = exemptions.indexOf(state) != -1 ? $rootScope.toParams.id : 0;

                        return $http.post(Routing.generate('is_authorized'), {roles: required, state: state, id: id});

                    };
                    this.isAuthenticated = function () {
                        return $http.get(Routing.generate('is_authenticated'))
                    };
                }]);
}());