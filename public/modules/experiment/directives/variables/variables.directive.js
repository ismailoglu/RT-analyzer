(function () {
    'use strict';
    angular
        .module('experiment')
        .directive('pcrVariables', variables);
    function variables() {
        return {
            bindToController: true,
            controller: [
                'experiment.experiment',
                'experiment.variableTypes',
                controller
            ],
            controllerAs: 'variables',
            scope: {
                type: '='
            },
            templateUrl: 'modules/experiment/directives/variables/variables.directive.html'
        };
        /**
         * functions
         */
        function controller(
            experiment,
            variableTypes
        ) {
            var
                vm;
            vm = this;
            vm.data = experiment.data;
            vm.variableTypeAsPropertyName = variableTypes[vm.type].asPropertyName;
            vm.add = experiment.metadata[vm.variableTypeAsPropertyName].add;
            vm.change = experiment.metadata[vm.variableTypeAsPropertyName].change;
            vm.onControlVariableChange = onControlVariableChange;
            vm.metadata = experiment.metadata;
            vm.remove = experiment.metadata[vm.variableTypeAsPropertyName].remove;
            vm.variableTypeAsPluralNoun = variableTypes[vm.type].asPluralNoun;
            vm.variableTypeAsSingularNoun = variableTypes[vm.type].asSingularNoun;
            //
            // functions
            //
            function onControlVariableChange() {
                if (vm.type === 'sample') {
                    experiment.metadata.helpers.coerceModel('controlSample');
                }
            }
        }
    }
}());
