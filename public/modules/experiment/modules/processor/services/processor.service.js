(function () {
    'use strict';
    angular
        .module('processor')
        .service('processor.processor', processor);
    processor.$inject = [
        'experiment.experiment',
        'experiment.simpleStatistics'
    ];
    function processor(
        experiment,
        simpleStatistics
    ) {
        var
            service;
        service = {
            processData: processData
        };
        return service;
        /*
         * function
         */
        function formatStep2() {
            var
                formatted;
            formatted = {};
            formatted.headers = [];
            formatted.rows = [];
            experiment.data.probes.forEach(function forEach(probeName) {
                if (probeName !== experiment.data.controlProbe) {
                    formatted.headers.push(probeName);
                }
            });
            experiment.data.samples.forEach(function forEach(sampleName) {
                var
                    row;
                row = [];
                row.sampleName = sampleName;
                formatted.headers.forEach(function forEach(probeName) {
                    row.push(experiment.data.analysis['step 2'][sampleName][probeName].relativeExpressionValue);
                });
                formatted.rows.push(row);
            });
            experiment.metadata.analysis['step 2'].formatted = formatted;
        }
        function formatStep3() {
            var
                formatted,
                formattedStandardDeviation,
                formattedStandardError;
            formatted = {};
            formattedStandardDeviation = {};
            formattedStandardError = {};
            formatted.headers = [];
            formattedStandardDeviation.headers = [];
            formattedStandardError.headers = [];
            formatted.rows = [];
            formattedStandardDeviation.rows = [];
            formattedStandardError.rows = [];
            experiment.data.probes.forEach(function forEach(probeName) {
                if (probeName !== experiment.data.controlProbe) {
                    formatted.headers.push(probeName);
                    formattedStandardDeviation.headers.push(probeName);
                    formattedStandardError.headers.push(probeName);
                }
            });
            Object.keys(experiment.data.analysis['step 3']).forEach(function forEach(sampleName) {
                var
                    row,
                    standardDeviationRow,
                    standardErrorRow;
                row = [];
                standardDeviationRow = [];
                standardErrorRow = [];
                row.sampleName = sampleName;
                standardDeviationRow.sampleName = sampleName;
                standardErrorRow.sampleName = sampleName;
                formatted.headers.forEach(function forEach(probeName) {
                    row.push(experiment.data.analysis['step 3'][sampleName][probeName].relativeExpressionValue);
                });
                formattedStandardDeviation.headers.forEach(function forEach(probeName) {
                    if (experiment.data.analysis['step 3'][sampleName][probeName].standardDeviation) {
                        standardDeviationRow.push(experiment.data.analysis['step 3'][sampleName][probeName].standardDeviation);
                    } else {
                        standardDeviationRow.push('');
                    }
                });
                formattedStandardError.headers.forEach(function forEach(probeName) {
                    if (experiment.data.analysis['step 3'][sampleName][probeName].standardError) {
                        standardErrorRow.push(experiment.data.analysis['step 3'][sampleName][probeName].standardError);
                    } else {
                        standardErrorRow.push('');
                    }
                });
                formatted.rows.push(row);
                formattedStandardDeviation.rows.push(standardDeviationRow);
                formattedStandardError.rows.push(standardErrorRow);
            });
            experiment.metadata.analysis['step 3'].formatted = formatted;
            experiment.metadata.analysis['step 3'].formattedStandardDeviation = formattedStandardDeviation;
            experiment.metadata.analysis['step 3'].formattedStandardError = formattedStandardError;
        }
        function processData() {
            if (!experiment.data.controlProbe) {
                alert('NO_CONTROL_PROBE');
                throw 'NO_CONTROL_PROBE';
            }
            processStep1();
            processStep2();
            processStep3();
        }
        function processStep1() {
            experiment.data.samples.forEach(function forEach(sample) {
                experiment.data.analysis['step 1'][sample] = {};
                experiment.data.plates.forEach(function forEach(plate) {
                    plate.positions.forEach(function forEach(position) {
                        if (plate[position].sample === sample) {
                            if (experiment.data.analysis['step 1'][sample][plate[position].probe] === undefined) {
                                experiment.data.analysis['step 1'][sample][plate[position].probe] = {};
                                if (experiment.data.analysis['step 1'][sample][plate[position].probe].cycles === undefined) {
                                    experiment.data.analysis['step 1'][sample][plate[position].probe].cycles = [];
                                }
                            }
                            experiment.data.analysis['step 1'][sample][plate[position].probe].cycles.push(plate[position].cycle);
                        }
                    });
                });
            });
            experiment.data.samples.forEach(function forEach(sample) {
                var
                    cycles,
                    probes,
                    total;
                probes = Object.keys(experiment.data.analysis['step 1'][sample]);
                probes.forEach(function forEach(probe) {
                    cycles = 0;
                    total = 0;
                    experiment.data.analysis['step 1'][sample][probe].cycles.forEach(function forEach(cycle) {
                        cycles += 1;
                        total += +cycle;
                    });
                    experiment.data.analysis['step 1'][sample][probe].average = total / cycles;
                });
            });
            experiment.metadata.analysis['step 1'].done = true;
        }
        function processStep2() {
            var
                controlProbeAverage,
                probeAverage;
            Object.keys(experiment.data.analysis['step 1']).forEach(function forEach(sampleName) {
                experiment.data.analysis['step 2'][sampleName] = {};
                Object.keys(experiment.data.analysis['step 1'][sampleName]).forEach(function forEach(probeName) {
                    if (probeName !== experiment.data.controlProbe) {
                        if (experiment.data.analysis['step 2'][sampleName][probeName] === undefined) {
                            experiment.data.analysis['step 2'][sampleName][probeName] = {};
                        }
                        controlProbeAverage = experiment.data.analysis['step 1'][sampleName][experiment.data.controlProbe].average;
                        probeAverage = experiment.data.analysis['step 1'][sampleName][probeName].average;
                        experiment.data.analysis['step 2'][sampleName][probeName].relativeExpressionValue = Math.pow(2, (controlProbeAverage - probeAverage));
                    }
                });
            });
            formatStep2();
            experiment.metadata.analysis['step 2'].done = true;
        }
        function processStep3() {
            experiment.metadata.biologicalReplicatesGroups.biologicalReplicates = [];
            Object.keys(experiment.data.biologicalReplicatesGroups).forEach(function forEach(biologicalReplicatesGroup) {
                experiment.data.analysis['step 3'][biologicalReplicatesGroup] = {};
                experiment.data.biologicalReplicatesGroups[biologicalReplicatesGroup].forEach(function forEach(biologicalReplicate) {
                    experiment.metadata.biologicalReplicatesGroups.biologicalReplicates.push(biologicalReplicate);
                    Object.keys(experiment.data.analysis['step 2'][biologicalReplicate]).forEach(function forEach(probe) {
                        if (experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe] === undefined) {
                            experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe] = [];
                        }
                        experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe].push(experiment.data.analysis['step 2'][biologicalReplicate][probe].relativeExpressionValue);
                    });
                });
                Object.keys(experiment.data.analysis['step 3'][biologicalReplicatesGroup]).forEach(function forEach(probe) {
                    var
                        relativeExpressionValue,
                        standardDeviation,
                        standardError;
                    if (experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe].length) {
                        experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe].total = 0;
                        experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe].forEach(function forEach(innerRelativeExpressionValue) {
                            experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe].total += innerRelativeExpressionValue;
                        });
                        relativeExpressionValue = experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe].total / experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe].length;
                        standardDeviation = Math.sqrt(simpleStatistics.variance(experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe]));
                        standardError = Math.sqrt(simpleStatistics.variance(experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe]) / (experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe].length - 1));
                        experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe] = {
                            relativeExpressionValue: relativeExpressionValue,
                            standardDeviation: standardDeviation,
                            standardError: standardError
                        };
                    }
                });
            });
            Object.keys(experiment.data.analysis['step 2']).forEach(function forEach(sample) {
                if (experiment.metadata.biologicalReplicatesGroups.biologicalReplicates.indexOf(sample) === -1) {
                    experiment.data.analysis['step 3'][sample] = experiment.data.analysis['step 2'][sample];
                }
            });
            formatStep3();
            experiment.metadata.analysis['step 3'].done = true;
        }
    }
}());
