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
                selected,
                vm;
            selected = [];
            vm = this;
            vm.experiment = experiment;
            // vm.data = experiment.data;
            vm.isFilled = isFilled;
            vm.isSelected = isSelected;
            // vm.metadata = experiment.metadata;
            vm.selectColumn = selectColumn;
            vm.selectPosition = selectPosition;
            vm.selectRow = selectRow;
            vm.set = set;
            vm.style = {
                backgroundColor: backgroundColor
            };
            vm.variableTypeAsPropertyName = variableTypes[vm.type].asPropertyName;
            vm.variableTypeAsSingularNoun = variableTypes[vm.type].asSingularNoun;
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
                if (
                    experiment.data.plates[plateIndex]
                    &&
                    experiment.data.plates[plateIndex][position]
                ) {
                    variable = experiment.data.plates[plateIndex][position][variableName];
                }
                if (variable) {
                    variableIndex = experiment.data[variableTypeAsPropertyName].indexOf(variable);
                    colour = experiment.metadata[variableTypeAsPropertyName].colours[variableIndex];
                    return colour;
                }
                return '#f8f8f8';
            }
            function clearSelected() {
                selected.length = 0;
            }
            function isFilled(variableTypeAsPropertyName, plateIndex, position) {
                var
                    variable,
                    variableName;
                if (variableTypeAsPropertyName === 'probes') {
                    variableName = 'probe';
                }
                if (variableTypeAsPropertyName === 'samples') {
                    variableName = 'sample';
                }
                if (
                    experiment.data.plates[plateIndex]
                    &&
                    experiment.data.plates[plateIndex][position]
                ) {
                    variable = experiment.data.plates[plateIndex][position][variableName];
                }
                if (variable) {
                    return true;
                }
                return false;
            }
            function isSelected(position) {
                var
                    indexOfPosition;
                indexOfPosition = selected.indexOf(position);
                if (indexOfPosition !== -1) {
                    return true;
                }
                return false;
            }
            function selectColumn(column, plateIndex) {
                experiment.data.plates[plateIndex].rows.forEach(function forEach(row) {
                    selectPosition(row + column);
                });
            }
            function selectPosition(position) {
                console.log(position)
                var
                    indexOfPosition;
                indexOfPosition = selected.indexOf(position);
                if (indexOfPosition === -1) {
                    selected.push(position);
                } else {
                    selected.splice(indexOfPosition, 1);
                }
            }
            function selectRow(row, plateIndex) {
                experiment.data.plates[plateIndex].columns.forEach(function forEach(column) {
                    selectPosition(row + column);
                });
            }
            function set(variableTypeAsPropertyName, plateIndex, variable) {
                var
                    variableName;
                if (variableTypeAsPropertyName === 'probes') {
                    variableName = 'probe';
                }
                if (variableTypeAsPropertyName === 'samples') {
                    variableName = 'sample';
                }
                selected.forEach(function forEach(position) {
                    experiment.data.plates[plateIndex][position][variableName] = variable;
                });
                clearSelected();
            }
        }
    }
}());
