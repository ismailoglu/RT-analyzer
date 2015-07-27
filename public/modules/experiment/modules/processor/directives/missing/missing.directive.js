(function () {
    'use strict';
    angular
        .module('processor')
        .directive('pcrMissing', directive);
    function directive() {
        return {
            templateUrl: 'modules/experiment/modules/processor/directives/missing/missing.directive.html'
        };
    }
}());
