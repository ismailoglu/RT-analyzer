(function () {
    'use strict';
    angular
        .module('plates')
        .directive('pcrPlate', directive);
    function directive() {
        return {
            templateUrl: 'modules/experiment/modules/plates/directives/configuration/configuration.directive.html'
        };
    }
}());
