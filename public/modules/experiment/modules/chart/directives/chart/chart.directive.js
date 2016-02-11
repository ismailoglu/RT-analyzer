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
        function controller(
            experiment
        ) {
            var
                vm;
            vm = this;
            vm.experiment = experiment;
            vm.relation = 'probesBySamples';
            vm.show = 'Error';
            vm.table = '2';
            vm.click = function click() {
                console.log(experiment);
                vm.data = makeDataForChart(vm.experiment, vm.relation, vm.show, vm.table);
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
            context = element.find('canvas')[0].getContext('2d');
            controller.makeChart = makeChart;
            controller.chartMade = null;
            //
            // functions
            //
            function makeChart(data) {
                if (
                    controller.chartMade !== null
                ) {
                    controller.chartMade.destroy();
                }
                controller.chartMade = new chartjs(context).Bar(data, {
                    responsive: true
                });
            }
        }
        function coloursForDataset(hexColour) {
            var
                rgbColour;
            rgbColour = hexToRgb(hexColour);
            return {
                fillColor : 'rgba(' + rgbColour.r + ', ' + rgbColour.g + ', ' + rgbColour.b + ', 0.5)',
                strokeColor : 'rgba(' + rgbColour.r + ', ' + rgbColour.g + ', ' + rgbColour.b + ', 0.8)',
                highlightFill: 'rgba(' + rgbColour.r + ', ' + rgbColour.g + ', ' + rgbColour.b + ', 0.75)',
                highlightStroke: 'rgba(' + rgbColour.r + ', ' + rgbColour.g + ', ' + rgbColour.b + ', 1)'
            };
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
        function hexToRgb(hex) {
            // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
            var result,
            shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });
            result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        function newDataset(experiment, label, relation) {
            var
                datasetColours;
            if (relation === 'samplesByProbes') {
                datasetColours = coloursForDataset(experiment.data.sampleList[label].colour);
            } else {
                datasetColours = coloursForDataset(experiment.data.probeList[label].colour);
            }
            return {
                label: label,
                fillColor: datasetColours.fillColor,
                strokeColor: datasetColours.strokeColor,
                highlightFill: datasetColours.highlightFill,
                highlightStroke: datasetColours.highlightStroke,
                data: [],
                error: []
            };
        }
        function makeDataForChart(
            experiment,
            relation,
            show,
            table
        ) {
            var
                data,
                datasets,
                labels,
                probes,
                rawData,
                samples;
            makeFinalProbeList(experiment);
            makeFinalSampleList(experiment);
            rawData = experiment.data.analysis['step ' + table];
            datasets = [];
            if (relation === 'samplesByProbes') {
                samples = Object.keys(rawData).filter(function (sample) {
                    return filterSamples(experiment, sample)
                });
                probes = experiment.data.probes.filter(function (probe) {
                    return filterProbes(experiment, probe);
                });
                samples.forEach(function (sample) {
                    datasets.push(newDataset(experiment, sample, relation));
                });
                probes.forEach(function forEachSample(probe) {
                    samples.forEach(function forEachProbe(sample, index) {
                        var
                        barValue,
                        errorBarValue;
                        if (
                            rawData[sample][probe]
                        ) {
                            barValue = rawData[sample][probe].relativeExpressionValue;
                            if (
                                rawData[sample][probe]['standard' + show]
                            ) {
                                errorBarValue = rawData[sample][probe]['standard' + show];
                            }
                        }
                        datasets[index].data.push(barValue || 0);
                        datasets[index].error.push(errorBarValue || 0);
                    });
                });
                data = {
                    labels: probes,
                    datasets: datasets
                };
                return data;
            }
            labels = Object.keys(rawData).filter(function (sample) {
                return filterSamples(experiment, sample)
            });
            probes = experiment.data.probes.filter(function (probe) {
                return filterProbes(experiment, probe);
            });
            probes.forEach(function (probe) {
                datasets.push(newDataset(experiment, probe));
            });
            labels.forEach(function forEachSample(sample) {
                probes.forEach(function forEachProbe(probe, index) {
                    var
                        barValue,
                        errorBarValue;
                    if (
                        rawData[sample][probe]
                    ) {
                        barValue = rawData[sample][probe].relativeExpressionValue;
                        if (
                            rawData[sample][probe]['standard' + show]
                        ) {
                            errorBarValue = rawData[sample][probe]['standard' + show];
                        }
                    }
                    datasets[index].data.push(barValue || 0);
                    datasets[index].error.push(errorBarValue || 0);
                });
            });
            data = {
                labels: labels,
                datasets: datasets
            };
            return data;
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
            if (experiment.data.controlSample) {
              experiment.data.samples.forEach(function forEachSample(sample, index) {
                experiment.data.sampleList[sample] = {};
                experiment.data.sampleList[sample].colour = experiment.metadata.samples.colours[index];
                experiment.data.sampleList[sample].checked = true;
                experiment.data.sampleList.list.push(sample);
              });
              return;
            }
            Object.keys(experiment.data.biologicalReplicatesGroups).forEach(function forEachBiologicalReplicatesGroupName(biologicalReplicateGroupName) {
                experiment.data.sampleList[biologicalReplicateGroupName] = {};
                experiment.data.sampleList[biologicalReplicateGroupName].colour = experiment.metadata.biologicalReplicatesGroups.colours[biologicalReplicateGroupName];
                experiment.data.sampleList[biologicalReplicateGroupName].checked = true;
                experiment.data.sampleList.list.push(biologicalReplicateGroupName);
            });
            experiment.data.samples.forEach(function forEachSample(sample, index) {
                if (
                    !experiment.metadata.biologicalReplicatesGroups.biologicalReplicates
                    ||
                    (
                        experiment.metadata.biologicalReplicatesGroups.biologicalReplicates
                        &&
                        experiment.metadata.biologicalReplicatesGroups.biologicalReplicates.indexOf(sample) === -1
                    )
                ) {
                    experiment.data.sampleList[sample] = {};
                    experiment.data.sampleList[sample].colour = experiment.metadata.samples.colours[index];
                    experiment.data.sampleList[sample].checked = true;
                    experiment.data.sampleList.list.push(sample);
                }
            });
        }
    }
}());
