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
            templateUrl: 'modules/experiment/modules/chart/directives/chart/chart.directive.html'
        };
        /**
         * functions
         */
        function  dummy(experiment) {
            var
                datasets,
                labels,
                rawData;
            makeFinalProbeList(experiment);
            makeFinalSampleList(experiment);
            rawData = experiment.data.analysis['step 2'];
            labels = Object.keys(rawData).filter(function (sample) {
                return filterSamples(experiment, sample)
            });
            datasets = [];
            var probesColours = [];
            var probes = experiment.data.probes.filter(
                function (probe, index) {
                    // if (
                    //     probe === experiment.data.controlProbe
                    // ) {
                    //     return false;
                    // }
                    if (
                        !filterProbes(experiment, probe)
                    ) {
                        return false;
                    }
                    probesColours.push(experiment.metadata.probes.colours[index]);
                    return true;
                }
            );
            probes.forEach(function (probe, index) {
                var thisColour = probesColours[index];
                var rgb = hexToRgb(thisColour);
                datasets.push({
                    label: probe,
                    fillColor : "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.5)",
                    strokeColor : "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.8)",
                    highlightFill: "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.75)",
                    highlightStroke: "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",1)",
                    data: []
                });
            });
            labels.forEach(function forEachSample(sample) {
                probes.forEach(function forEachProbe(probe, index) {
                    var
                        value = 0;
                    if (
                        rawData[sample][probe]
                    ) {
                        value = rawData[sample][probe].relativeExpressionValue;
                    }
                    datasets[index].data.push(value || 0);
                });
            });
            var data = {
                labels: labels,
                datasets: datasets
            };
            return data;
        }
        function filterSamples(experiment, sample) {
            if (
                experiment.data.sampleList[sample]
                &&
                experiment.data.sampleList[sample].checked
            ) {
                return true;
            }
            return false;
        }
        function filterProbes(experiment, probe) {
            if (
                experiment.data.probeList[probe]
                &&
                experiment.data.probeList[probe].checked
            ) {
                return true;
            }
            return false;
        }
        function makeFinalProbeList(experiment) {
            if (
                experiment.data.probeList !== undefined
            ) {
                return;
            }
            experiment.data.probeList = {};
            experiment.data.probeList.list = [];
            experiment.data.probes.forEach(function forEachProbe(probe, index) {
                experiment.data.probeList[probe] = {};
                experiment.data.probeList[probe].colour = experiment.metadata.probes.colours[index];
                experiment.data.probeList[probe].checked = true;
                experiment.data.probeList.list.push(probe);
            });
        }
        function makeFinalSampleList(experiment) {
            if (
                experiment.data.sampleList !== undefined
            ) {
                return;
            }
            experiment.data.sampleList = {};
            experiment.data.sampleList.list = [];
            Object.keys(experiment.data.biologicalReplicatesGroups).forEach(function forEachBiologicalReplicatesGroupName(biologicalReplicateGroupName) {
                experiment.data.sampleList[biologicalReplicateGroupName] = {};
                experiment.data.sampleList[biologicalReplicateGroupName].colour = experiment.metadata.biologicalReplicatesGroups.colours[biologicalReplicateGroupName];
                experiment.data.sampleList[biologicalReplicateGroupName].checked = true;
                experiment.data.sampleList.list.push(biologicalReplicateGroupName);
            });
            experiment.data.samples.forEach(function forEachSample(sample, index) {
                if (
                    experiment.metadata.biologicalReplicatesGroups.biologicalReplicates
                ) {
                    if (
                        experiment.metadata.biologicalReplicatesGroups.biologicalReplicates.indexOf(sample) === -1
                    ) {
                        experiment.data.sampleList[sample] = {};
                        experiment.data.sampleList[sample].colour = experiment.metadata.samples.colours[index];
                        experiment.data.sampleList[sample].checked = true;
                        experiment.data.sampleList.list.push(sample);
                    }
                } else {
                    experiment.data.sampleList[sample] = {};
                    experiment.data.sampleList[sample].colour = experiment.metadata.samples.colours[index];
                    experiment.data.sampleList[sample].checked = true;
                    experiment.data.sampleList.list.push(sample);
                }
            });
        }
        function hexToRgb(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        function controller(
            experiment
        ) {
            var
                vm;
            vm = this;
            vm.experiment = experiment;
            vm.click = function click() {
                console.log(experiment);
                vm.data = dummy(experiment);
                vm.chart = vm.makeChart(vm.data);
            }
        }
        function link(
            scope,
            element,
            attribute,
            controller
        ) {
            var
                context;
            context = element.find('canvas')[0].getContext("2d");
            controller.makeChart = makeChart;
            //
            // functions
            //
            function makeChart(data) {
                return new chartjs(context).Bar(data, {
                    responsive: true
                });
            }
        }
    }
}());
