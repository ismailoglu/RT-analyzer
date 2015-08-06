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
        function formatStep2(step) {
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
                    if (
                        experiment.data.analysis[step][sampleName]
                        &&
                        experiment.data.analysis[step][sampleName][probeName]
                        &&
                        experiment.data.analysis[step][sampleName][probeName].relativeExpressionValue
                    ) {
                        row.push(experiment.data.analysis[step][sampleName][probeName].relativeExpressionValue);
                    } else {
                        row.push('n/a');
                    }
                });
                formatted.rows.push(row);
            });
            experiment.metadata.analysis[step].formatted = formatted;
        }
        function formatStep3(step) {
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
            Object.keys(experiment.data.analysis[step]).forEach(function forEach(sampleName) {
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
                    if (
                        experiment.data.analysis[step][sampleName]
                        &&
                        experiment.data.analysis[step][sampleName][probeName]
                        &&
                        experiment.data.analysis[step][sampleName][probeName].relativeExpressionValue
                    ) {
                        row.push(experiment.data.analysis[step][sampleName][probeName].relativeExpressionValue);
                    } else {
                        row.push('n/a');
                    }
                });
                formattedStandardDeviation.headers.forEach(function forEach(probeName) {
                    if (
                        experiment.data.analysis[step][sampleName]
                        &&
                        experiment.data.analysis[step][sampleName][probeName]
                    ) {
                        if (experiment.data.analysis[step][sampleName][probeName].standardDeviation) {
                            standardDeviationRow.push(experiment.data.analysis[step][sampleName][probeName].standardDeviation);
                        } else {
                            standardDeviationRow.push('n/a');
                        }
                    } else {
                        standardDeviationRow.push('n/a');
                    }
                });
                formattedStandardError.headers.forEach(function forEach(probeName) {
                    if (
                        experiment.data.analysis[step][sampleName]
                        &&
                        experiment.data.analysis[step][sampleName][probeName]
                    ) {
                        if (experiment.data.analysis[step][sampleName][probeName].standardError) {
                            standardErrorRow.push(experiment.data.analysis[step][sampleName][probeName].standardError);
                        } else {
                            standardErrorRow.push('n/a');
                        }
                    } else {
                        standardErrorRow.push('n/a');
                    }
                });
                formatted.rows.push(row);
                formattedStandardDeviation.rows.push(standardDeviationRow);
                formattedStandardError.rows.push(standardErrorRow);
            });
            experiment.metadata.analysis[step].formatted = formatted;
            experiment.metadata.analysis[step].formattedStandardDeviation = formattedStandardDeviation;
            experiment.metadata.analysis[step].formattedStandardError = formattedStandardError;
        }
        function reset() {
            experiment.data.analysis['step 1'] = {};
            experiment.data.analysis['step 2'] = {};
            experiment.data.analysis['step 3'] = {};
            experiment.data.analysis['step 4'] = {};
            experiment.metadata.analysis['step 1'] = {
                done: false,
                show: false
            };
            experiment.metadata.analysis['step 2'] = {
                done: false,
                show: false
            };
            experiment.metadata.analysis['step 3'] = {
                done: false
            };
            experiment.metadata.analysis['step 4'] = {
                done: false
            };
            experiment.metadata.missing = {};
            experiment.metadata.missingDone = false;
        }
        function processData() {
            reset();
            if (!experiment.data.controlProbe) {
                alert('NO_CONTROL_PROBE');
                throw 'NO_CONTROL_PROBE';
            }
            processStep1();
            processStep2();
            if (Object.keys(experiment.data.biologicalReplicatesGroups).length) {
                processStep3();
                if (
                    experiment.data.controlBiologicalReplicatesGroup
                    ||
                    experiment.data.controlSample
                ) {
                    processStep4();
                }
            } else {
                experiment.metadata.analysis['step 2'].show = true;
                if (
                    experiment.data.controlBiologicalReplicatesGroup
                    ||
                    experiment.data.controlSample
                ) {
                    otherProcessStep4();
                }
            }
        }
        function processStep1() {
            experiment.data.samples.forEach(function forEach(sample) {
                experiment.data.analysis['step 1'][sample] = {};
                experiment.data.plates.forEach(function forEach(plate, index) {
                    plate.positions.forEach(function forEach(position) {
                        if (plate[position].sample === sample) {
                            if (experiment.data.analysis['step 1'][sample][plate[position].probe] === undefined) {
                                experiment.data.analysis['step 1'][sample][plate[position].probe] = {};
                                if (experiment.data.analysis['step 1'][sample][plate[position].probe].cycles === undefined) {
                                    experiment.data.analysis['step 1'][sample][plate[position].probe].cycles = [];
                                }
                            }
                            if (plate[position].cycle) {
                                experiment.data.analysis['step 1'][sample][plate[position].probe].cycles.push(plate[position].cycle);
                            } else {
                                if (!experiment.metadata.missing[index + 1]) {
                                    experiment.metadata.missing[index + 1] = {};
                                }
                                if (!experiment.metadata.missing[index + 1][position]) {
                                    experiment.metadata.missing[index + 1][position] = {};
                                }
                                experiment.metadata.missing[index + 1][position].sample = sample;
                                experiment.metadata.missing[index + 1][position].probe = plate[position].probe;
                                experiment.metadata.missingDone = true;
                            }
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
                    if (cycles > 0) {
                        experiment.data.analysis['step 1'][sample][probe].average = total / cycles;
                    }
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
                        if (probeAverage) {
                            experiment.data.analysis['step 2'][sampleName][probeName].relativeExpressionValue = Math.pow(2, (controlProbeAverage - probeAverage));
                        }
                    }
                });
            });
            formatStep2('step 2');
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
                        if (experiment.data.analysis['step 2'][biologicalReplicate][probe].relativeExpressionValue) {
                            experiment.data.analysis['step 3'][biologicalReplicatesGroup][probe].push(experiment.data.analysis['step 2'][biologicalReplicate][probe].relativeExpressionValue);
                        }
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
            formatStep3('step 3');
            experiment.metadata.analysis['step 3'].done = true;
        }
        function processStep4() {
            var
                compareTo,
                control;
            if (experiment.data.controlBiologicalReplicatesGroup) {
                control = experiment.data.controlBiologicalReplicatesGroup;
                compareTo = 'step 3';
            } else {
                control = experiment.data.controlSample;
                compareTo = 'step 2';
            }
            experiment.data.analysis['step 4'] = angular.copy(experiment.data.analysis['step 3']);
            Object.keys(experiment.data.analysis['step 4']).forEach(function forEachSampleOrBiologicalReplicatesGroup(sampleOrBiologicalReplicatesGroup) {
                Object.keys(experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup]).forEach(function forEachValue(probe) {
                    // if control sample look for value on step 2
                    // if control biorep group look for value on step 3
                    if (
                        experiment.data.analysis[compareTo][control][probe]
                    ) {
                        if (
                            experiment.data.analysis[compareTo][control][probe].relativeExpressionValue
                            &&
                            experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].relativeExpressionValue
                        ) {
                            experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].relativeExpressionValue /= experiment.data.analysis[compareTo][control][probe].relativeExpressionValue;
                        }
                        if (
                            experiment.data.analysis[compareTo][control][probe].standardDeviation
                            &&
                            experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].standardDeviation
                        ) {
                            experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].standardDeviation /= experiment.data.analysis[compareTo][control][probe].standardDeviation;
                        }
                        if (
                            experiment.data.analysis[compareTo][control][probe].standardError
                            &&
                            experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].standardError
                        ) {
                            experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].standardError /= experiment.data.analysis[compareTo][control][probe].standardError;
                        }
                    } else {
                        experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].relativeExpressionValue = 'n/a';
                        experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].standardDeviation = 'n/a';
                        experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].standardError = 'n/a';
                    }
                });
            });
            formatStep3('step 4'); // reusing formatStep3()
            experiment.metadata.analysis['step 4'].done = true;
        }
        function otherProcessStep4() {
            var
                control;
            if (experiment.data.controlBiologicalReplicatesGroup) {
                control = experiment.data.controlBiologicalReplicatesGroup;
            } else {
                control = experiment.data.controlSample;
            }
            experiment.data.analysis['step 4'] = angular.copy(experiment.data.analysis['step 2']);
            Object.keys(experiment.data.analysis['step 4']).forEach(function forEachSampleOrBiologicalReplicatesGroup(sampleOrBiologicalReplicatesGroup) {
                Object.keys(experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup]).forEach(function forEachValue(probe) {
                    if (
                        experiment.data.analysis['step 2'][control][probe]
                    ) {
                        if (
                            experiment.data.analysis['step 2'][control][probe].relativeExpressionValue
                            &&
                            experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].relativeExpressionValue
                        ) {
                            experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].relativeExpressionValue /= experiment.data.analysis['step 2'][control][probe].relativeExpressionValue;
                        }
                        if (
                            experiment.data.analysis['step 2'][control][probe].standardDeviation
                            &&
                            experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].standardDeviation
                        ) {
                            experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].standardDeviation /= experiment.data.analysis['step 2'][control][probe].standardDeviation;
                        }
                        if (
                            experiment.data.analysis['step 2'][control][probe].standardError
                            &&
                            experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].standardError
                        ) {
                            experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].standardError /= experiment.data.analysis['step 2'][control][probe].standardError;
                        }
                    } else {
                        experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].relativeExpressionValue = 'n/a';
                        experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].standardDeviation = 'n/a';
                        experiment.data.analysis['step 4'][sampleOrBiologicalReplicatesGroup][probe].standardError = 'n/a';
                    }
                });
            });
            formatStep2('step 4'); // reusing formatStep2()
            experiment.metadata.analysis['step 4'].done = true;
        }
    }
}());
