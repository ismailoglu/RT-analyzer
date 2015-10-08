(function () {
    'use strict';
    angular
        .module('plates')
        .controller('Plates', controller);
    controller.$inject = [
        'experiment.experiment',
        'plates.plates'
    ];
    function controller(
        experiment,
        plates
    ) {
        var
            vm;
        vm = this;
        vm.addPlate = addPlate;
        vm.currentPlateIndex = 0;
        vm.experiment = experiment;
        // vm.data = experiment.data;
        //
        // functions
        //
        function addPlate(nextIndex) {
            vm.currentPlateIndex = nextIndex;
            plates.addPlate();
        }
    }
}());
