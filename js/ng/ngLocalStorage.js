angular.module('ol3App').service('ol3LocalStorage', ['$rootScope', function ($rootScope) {
    var service = {
        interactions: [],

        SaveState: function () {
            localStorage.interactions = angular.toJson(service.interactions);
        },

        RestoreState: function () {
            if (localStorage.interactions) {
                service.interactions = angular.fromJson(localStorage.interactions);
            }
        }
    }

    $rootScope.$on("savestate", service.SaveState);

    return service;
}]);