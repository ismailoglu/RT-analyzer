(function () {
    'use strict';
    angular
        .module('processor')
        .controller('Processor', controller);
    controller.$inject = [
        'experiment.experiment',
        'processor.processor'
    ];
    function controller(
        experiment,
        processor
    ) {
        var
            vm;
        vm = this;
        vm.data = experiment.data;
        vm.intoCSVList = intoCSVList;
        vm.metadata = experiment.metadata;
        vm.processData = processor.processData;
        /*
         * functions
         */
        function intoCSVList(array) {
            return array.join(', ');
        }
    }
}());
