(function () {
    'use strict';
    angular
        .module('plates')
        .service('plates.plates', plates);
    plates.$inject = [
        'experiment.experiment',
        'experiment.papa'
    ];
    function plates(
        experiment,
        Papa
    ) {
        var
            service;
        service = {
            addPlate: addPlate,
            makePlate: makePlate,
            processData: processData
        };
        return service;
        /*
         * function
         */
        function addPlate() {
            experiment.data.plates.push(makePlate({
                columns: 12,
                rows: 8
            }, false));
        }
        function makePlate(size, showConfiguration) {
            var
                columnsLength,
                iterator1,
                iterator2,
                plate,
                position,
                rows,
                rowsLength;
            plate = {
                columns: [],
                positions: [],
                rows: [],
                showConfiguration: showConfiguration,
                size: size
            };
            for (iterator2 = 0, columnsLength = size.columns; iterator2 < columnsLength; iterator2 += 1) {
                plate.columns.push(iterator2 + 1);
            }
            rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            for (iterator1 = 0, rowsLength = size.rows; iterator1 < rowsLength; iterator1 += 1) {
                plate.rows.push(rows[iterator1]);
                for (iterator2 = 0, columnsLength = size.columns; iterator2 < columnsLength; iterator2 += 1) {
                    position = rows[iterator1] + (iterator2 + 1);
                    plate.positions.push(position);
                    plate[position] = {
                        cycle: '',
                        probe: '',
                        sample: ''
                    };
                }
            }
            return plate;
        }
        function processData(data, plateIndex) {
            Papa.parse(data, {
                complete: function onComplete(results) {
                    results.data.forEach(function forEach(row, index) {
                        var
                            cycle,
                            position,
                            probe,
                            sample;
                        if (index > 0) {
                            cycle = row[1];
                            position = row[0];
                            probe = row[3];
                            sample = row[2];
                            if (probe) {
                                experiment.metadata.probes.add(probe);
                                experiment.data.plates[plateIndex][position].probe = probe;
                            }
                            if (sample) {
                                experiment.metadata.samples.add(sample);
                                experiment.data.plates[plateIndex][position].sample = sample;
                            }
                            if (position) {
                                experiment.data.plates[plateIndex][position].cycle = cycle;
                            }
                        }
                    });
                }
            });
        }
    }
}());
