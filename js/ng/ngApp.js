var app = angular.module('ol3App', []);

app.run(function ($rootScope) {
    window.onbeforeunload = function (event) {
        $rootScope.$broadcast('savestate');
    };
});