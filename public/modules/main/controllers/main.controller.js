(function () {
    'use strict';
    angular
        .module('main')
        .controller('Main', Main);
    function Main() {
        var
            vm;
        vm = this;
        vm.currentView = 'modules/experiment/templates/experiment.template.html';
    }
}());
