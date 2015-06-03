(function () {
    'use strict';
    angular
        .module('plates')
        .directive('pcrReader', directive);
    directive.$inject = [
        'plates.plates'
    ];
    function directive(
        plates
    ) {
        return {
            link: link,
            templateUrl: 'modules/experiment/modules/plates/directives/reader/reader.directive.html'
        };
        /*
         * functions
         */
        function link(scope, element) {
            element.find('input').on('change', function onChange(onChangeEvent) {
                var
                    fileReader;
                fileReader = new FileReader();
                fileReader.onload = onLoad;
                fileReader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
            /*
             * functions
             */
            function onLoad(onLoadEvent) {
                plates.processData(onLoadEvent.target.result, scope.$index);
                scope.$apply();
            }
        }
    }
}());
