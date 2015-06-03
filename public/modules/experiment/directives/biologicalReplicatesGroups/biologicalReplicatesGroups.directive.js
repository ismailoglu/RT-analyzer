(function () {
    'use strict';
    angular
        .module('experiment')
        .directive('pcrBiologicalReplicatesGroups', biologicalReplicatesGroups);
    function biologicalReplicatesGroups() {
        return {
            bindToController: true,
            controller: [
                'experiment.experiment',
                controller
            ],
            controllerAs: 'biologicalReplicatesGroups',
            templateUrl: 'modules/experiment/directives/biologicalReplicatesGroups/biologicalReplicatesGroups.directive.html'
        };
        /**
         * functions
         */
        function controller(
            experiment
        ) {
            var
                vm;
            vm = this;
            vm.add = experiment.metadata.biologicalReplicatesGroups.add;
            vm.data = experiment.data;
            vm.metadata = experiment.metadata;
            vm.remove = experiment.metadata.biologicalReplicatesGroups.remove;
        }
    }
}());
