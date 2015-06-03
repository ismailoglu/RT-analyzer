(function () {
    'use strict';
    angular
        .module('processor')
        .directive('pcrAnalysisStep1', directive);
    function directive() {
        return {
            templateUrl: 'modules/experiment/modules/processor/directives/analysis.step1/analysis.step1.directive.html'
        };
    }
}());
