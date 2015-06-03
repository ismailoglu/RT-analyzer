(function () {
    'use strict';
    angular
        .module('plates')
        .directive('pcrAllocator', directive);
    function directive() {
        return {
            bindToController: true,
            controller: [
                'experiment.experiment',
                'experiment.variableTypes',
                controller
            ],
            controllerAs: 'allocator',
            scope: {
                plateIndex: '=',
                type: '='
            },
            templateUrl: 'modules/experiment/modules/plates/directives/allocator/allocator.directive.html'
        };
        /*
         *
         */
        function controller(
            experiment,
            variableTypes
        ) {
            var
                vm;
            vm = this;
            vm.data = experiment.data;
            vm.metadata = experiment.metadata;
            vm.variableTypeAsPropertyName = variableTypes[vm.type].asPropertyName;
            vm.variableTypeAsSingularNoun = variableTypes[vm.type].asSingularNoun;
            vm.style = {
                backgroundColor: backgroundColor
            };
            /*
             * functions
             */
            function backgroundColor(variableTypeAsPropertyName, plateIndex, position) {
                var
                    colour,
                    variable,
                    variableIndex,
                    variableName;
                if (variableTypeAsPropertyName === 'probes') {
                    variableName = 'probe';
                }
                if (variableTypeAsPropertyName === 'samples') {
                    variableName = 'sample';
                }
                variable = experiment.data.plates[plateIndex][position][variableName];
                if (variable) {
                    variableIndex = experiment.data[variableTypeAsPropertyName].indexOf(variable);
                    colour = experiment.metadata[variableTypeAsPropertyName].colours[variableIndex];
                    return colour;
                }
                return '#f8f8f8';
            }
        }
    }
}());
