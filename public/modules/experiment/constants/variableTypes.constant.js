(function () {
    'use strict';
    var
        constant;
    constant = {};
    angular
        .module('experiment')
        .constant('experiment.variableTypes', constant);
    constant.probe = {
        asPropertyName: 'probes',
        asPluralNoun: 'Probes',
        asSingularNoun: 'Probe'
    };
    constant.sample = {
        asPropertyName: 'samples',
        asPluralNoun: 'Samples',
        asSingularNoun: 'Sample'
    };
}());
