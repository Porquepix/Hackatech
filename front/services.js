/**
* Services
*/
    /**
     * Form helper.
     */
    app.service('form', function($http, $rootScope) {

        /**
         * Populate a data object with the fields of the form which have changed.
         */
        this.populate = function(form, data) {
            angular.forEach(form, function(value, key) {
                if(key[0] == '$') return;

                if (value.$dirty) {
                    data[key] = value.$modelValue;
                }
            });
        };

    });