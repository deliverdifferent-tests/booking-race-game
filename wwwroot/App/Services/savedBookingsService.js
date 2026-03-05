angular
    .module("urgentOnePageBooking")
    .factory("savedBookingsService", ["$http", function ($http) {
        return {
            getClients: function () {
                return $http.get("API/Client")
                    .then((response) => response.data);
            },
            getAllClients: function () {
                return $http.get(`API/Client/${'all'}`)
                    .then((response) => response.data);
            },
            getJobSaveds: function (clientId) {
                return $http.get(`API/JobSaved/${clientId}`)
                    .then((response) => response.data);
            },
            getSpeeds: function (clientId) {
                return $http.get(`API/speed/${clientId}`)
                    .then((response) => response.data);
            },
            getContacts: function (clientId) {
                return $http.get(`api/Contact/${clientId}`)
                    .then((response) => response.data);
            },
            updateSavedBooking: function (clientId, savedBooking) {
                return $http.post(`API/JobSaved/${clientId}/${'update'}`, savedBooking)
                    .then((response) => response.data);
            },
            createSavedBooking: function (clientId, savedBooking) {
                return $http.post(`API/JobSaved/${clientId}`, savedBooking)
                    .then((response) => response.data);
            },
            deleteSavedBooking: function (savedBookingId) {
                return $http.delete(`API/JobSaved/${savedBookingId}`)
                    .then((response) => response.data);
            },
            getVehicleSizes: function (clientId) {
                return $http.get(`api/VehicleSize/${clientId}`)
                    .then((response) => response.data);
            },
            getCountryCode: function () {
                return $http.get(`CountryCode`)
                    .then((response) => response.data);
            },
            getSuburbs: function () {
                return $http.get("API/Suburb")
                    .then((response) => response.data);
            }
        }
    }]);