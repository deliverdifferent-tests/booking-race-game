angular
    .module("urgentOnePageBooking")
    .factory("reportsService", ["$http", function ($http) {
        return {
            getClients: function () {
                return $http.get("API/Client")
                    .then((response) => response.data);
            },
            getAllClients: function () {
                return $http.get(`API/Client/${'all'}`)
                    .then((response) => response.data);
            },
            getIngramManifestReport: function (date, time, clientId, format, fileName) {
                return $http.get(`Reports/${date}/${time}/${clientId}/${format}/${fileName}`, { responseType: 'blob' })
                    .then((response) => response.data);
            }
        }
    }]);