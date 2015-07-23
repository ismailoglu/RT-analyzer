(function () {
    'use strict';
    angular
        .module('processor')
        .directive('pcrAnalysisStep4', directive);
    function directive() {
        return {
            templateUrl: 'modules/experiment/modules/processor/directives/analysis.step4/analysis.step4.directive.html'
        };
    }
}());
