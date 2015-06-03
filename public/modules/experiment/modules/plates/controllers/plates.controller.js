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
        vm.addPlate = plates.addPlate;
        vm.data = experiment.data;
    }
}());
