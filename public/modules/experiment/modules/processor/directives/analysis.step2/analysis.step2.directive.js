(function () {
    'use strict';
    angular
        .module('processor')
        .directive('pcrAnalysisStep2', directive);
    function directive() {
        return {
            templateUrl: 'modules/experiment/modules/processor/directives/analysis.step2/analysis.step2.directive.html'
        };
    }
}());
