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
        vm.intoCSVList = intoCSVList;
        vm.processData = processor.processData;
        /*
         * functions
         */
        function intoCSVList(array) {
            return array.join(', ');
        }
    }
}());
