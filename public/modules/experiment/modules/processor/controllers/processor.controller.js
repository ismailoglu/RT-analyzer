(function () {
    'use strict';
    angular
        .module('processor')
        .controller('Processor', controller);
    controller.$inject = [
        '$route',
        'experiment.experiment',
        'processor.processor'
    ];
    function controller(
        $route,
        experiment,
        processor
    ) {
        var
            vm;
        vm = this;
        vm.experiment = experiment;
        // vm.data = experiment.data;
        vm.intoCSVList = intoCSVList;
        // vm.metadata = experiment.metadata;
        vm.processData = processor.processData;
        // console.log(experiment)
        experiment.raw = JSON.stringify(
            experiment,
            function replacer(key, value) {
                if (key === "raw") {
                    return undefined;
                }
                return value;
            }
        );
        // vm.allData = experiment.raw;
        vm.load = function load() {
            var reload = JSON.parse(vm.allData);
            reload.metadata.biologicalReplicatesGroups.add = experiment.metadata.biologicalReplicatesGroups.add;
            reload.metadata.biologicalReplicatesGroups.remove = experiment.metadata.biologicalReplicatesGroups.remove;
            reload.metadata.helpers.coerceModel = experiment.metadata.helpers.coerceModel;
            reload.metadata.probes.add = experiment.metadata.probes.add;
            reload.metadata.probes.change = experiment.metadata.probes.change;
            reload.metadata.probes.remove = experiment.metadata.probes.remove;
            reload.metadata.samples.add = experiment.metadata.samples.add;
            reload.metadata.samples.change = experiment.metadata.samples.change;
            reload.metadata.samples.remove = experiment.metadata.samples.remove;
            reload.metadata.biologicalReplicatesGroups.add = experiment.metadata.biologicalReplicatesGroups.add;
            reload.metadata.biologicalReplicatesGroups.change = experiment.metadata.biologicalReplicatesGroups.change;
            reload.metadata.biologicalReplicatesGroups.remove = experiment.metadata.biologicalReplicatesGroups.remove;
            experiment.data = reload.data;
            experiment.metadata = reload.metadata;
        }
        vm.gen = function gen() {
            // experiment.raw = JSON.stringify(
            //     experiment,
            //     function replacer(key, value) {
            //         if (key === "raw") {
            //             return undefined;
            //         }
            //         return value;
            //     }
            // );
            vm.allData = experiment.raw;
        }
        /*
         * functions
         */
        function intoCSVList(array) {
            return array.join(', ');
        }
    }
}());
