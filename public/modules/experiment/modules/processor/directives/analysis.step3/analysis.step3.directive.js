(function () {
    'use strict';
    angular
        .module('processor')
        .directive('pcrAnalysisStep3', directive);
    function directive() {
        return {
            templateUrl: 'modules/experiment/modules/processor/directives/analysis.step3/analysis.step3.directive.html'
        };
    }
}());
