(function () {
    'use strict';
    angular
        .module('chart')
        .directive('pcrChart', [
            'chart.chartjs',
            directive
        ]);
    function directive(
        chartjs
    ) {
        return {
            bindToController: true,
            controller: [
                'experiment.experiment',
                controller
            ],
            controllerAs: 'chart',
            link: link,
            scope: {
                type: '='
            },
            templateUrl: 'modules/experiment/modules/chart/directives/chart/chart.directive.html'
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
            vm.experiment = experiment;
        }
        function link(
            scope,
            element
        ) {
            var
                canvas;
            canvas = element.find('canvas')[0];
            var randomScalingFactor = function(){return Math.round(Math.random()*100)};
            var barChartData5 = {
                labels : ["January","February","March","April","May","June","July"],
                datasets : [
                    {
                        label: "Protenúria",
                        fillColor : "rgba(220,220,220,0.5)",
                        strokeColor : "rgba(220,220,220,0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()],
                        error : [randomScalingFactor()/10,randomScalingFactor()/10,randomScalingFactor()/10,randomScalingFactor()/10,randomScalingFactor()/10,randomScalingFactor()/10,randomScalingFactor()/10]
                    },
                    {
                        label: "ACTB",
                        fillColor : "rgba(151,187,205,0.5)",
                        strokeColor : "rgba(151,187,205,0.8)",
                        highlightFill : "rgba(151,187,205,0.75)",
                        highlightStroke : "rgba(151,187,205,1)",
                        data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()],
                        error : [randomScalingFactor()/10,randomScalingFactor()/10,randomScalingFactor()/10,randomScalingFactor()/10,randomScalingFactor()/10,randomScalingFactor()/10,randomScalingFactor()/10]
                    }
                ]
            };
            // window.onload = function(){
            var ctx5 = canvas.getContext("2d");
            new chartjs(ctx5).Bar(barChartData5, {
                responsive : true
            });
        }
    }
}());
