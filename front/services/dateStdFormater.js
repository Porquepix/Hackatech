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
                result = data.replace(/(.+) (.+)/, "$1T$2Z");
                result = new Date(result);
                return result;
            }
        };
    });