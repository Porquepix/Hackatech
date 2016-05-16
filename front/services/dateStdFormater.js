    app.service('dateStdFormater', function() {
        var service = this;

        service.format = function(data, properties) {
            if (Array.isArray(data)) {
                data.forEach(function(row) {
                    properties.forEach(function(elem) {
                        row[elem + '_std'] = service.format(row[elem]);
                    });
                });
            } else {
                var result = data.replace(/(.+) (.+)/, "$1T$2Z");
                result = new Date(result);
                return service.toUTCDate(result);
            }
        };

        service.toUTCDate = function(date){
            var result = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            return result;
        };
    });